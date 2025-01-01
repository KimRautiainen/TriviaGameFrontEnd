import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverUrl} from '../utils/app-config';
import LottieView from 'lottie-react-native';

const RankedScreen = ({navigation}) => {
  const {user} = useContext(MainContext); // Access user data and token from context
  const {rank, rankLevel, currentPoints, pointsToNextRank} = user; // Destructure user state

  const [ws, setWs] = useState(null); // WebSocket state
  const [isFindingMatch, setIsFindingMatch] = useState(false); // Matchmaking state
  const [timeoutId, setTimeoutId] = useState(null); // Store timeout ID
  const progress = currentPoints / pointsToNextRank; // Calculate progress for the progress bar

  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve token
      if (!token) {
        Alert.alert('Error', 'User token not found. Please log in.');
        return;
      }
      const websocket = new WebSocket(serverUrl, token);

      websocket.onopen = () => {
        console.log('WebSocket connection established.');
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'match_found') {
          clearTimeout(timeoutId); // Clear the timeout when match is found
          setIsFindingMatch(false); // Stop animation
          Alert.alert('Match Found!', 'Opponent Found! Starting the game.');
          navigation.navigate('RankedGameScreen', {
            gameId: message.payload.gameId, 
            opponent: message.payload.opponent,
            questions: message.payload.questions, // Pass questions to the game screen
          });
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        Alert.alert('Error', 'WebSocket connection failed.');
      };

      websocket.onclose = () => {
        console.log('WebSocket connection closed.');
      };

      setWs(websocket); // Save WebSocket instance in state
    };

    initializeWebSocket();

    // Cleanup WebSocket on unmount
    return () => {
      if (ws) {
        ws.close();
        console.log('WebSocket connection cleaned up.');
      }
    };
  }, []);

  const handleFindMatch = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setIsFindingMatch(true); // Show animation
      ws.send(JSON.stringify({type: 'join_matchmaking', payload: {}}));

      // Set a timeout to notify the user if no match is found within 20 seconds
      const id = setTimeout(() => {
        setIsFindingMatch(false); // Stop animation
        Alert.alert('Timeout', 'No match found within 20 seconds.');
        handleCancelMatchmaking(); // Leave matchmaking pool
      }, 20000);

      setTimeoutId(id); // Store timeout ID
    } else {
      Alert.alert('Error', 'WebSocket connection is not open.');
    }
  };

  const handleCancelMatchmaking = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({type: 'leave_matchmaking', payload: {}}));
    }
    clearTimeout(timeoutId); // Clear the timeout
    setIsFindingMatch(false); // Stop animation
    Alert.alert('Matchmaking Cancelled', 'You have left the matchmaking pool.');
  };

  return (
    <View style={styles.container}>
      {/* Info Section */}
      {!isFindingMatch ? (
        <>
          <Text style={styles.header}>Ranked Game Mode</Text>
          <Text style={styles.info}>
            Compete against other players to earn points and climb the ranks! Answer
            trivia questions quickly and accurately to win.
          </Text>

          {/* Rank Progression */}
          <View style={styles.rankSection}>
            <Text style={styles.rankText}>
              Current Rank: {rank} (Level {rankLevel})
            </Text>
            <Text style={styles.progressText}>
              {currentPoints} / {pointsToNextRank} Points
            </Text>
          </View>

          {/* Find Match Button */}
          <TouchableOpacity style={styles.button} onPress={handleFindMatch}>
            <Text style={styles.buttonText}>Find Match</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.matchingContainer}>
          <LottieView
            source={require('../assets/animations/searchPlayers.json')}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.matchingText}>Looking for Opponent...</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelMatchmaking}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  rankSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 250,
    height: 250,
  },
  matchingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  cancelButton: {
    backgroundColor: 'black',
    marginTop: 50,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RankedScreen;
