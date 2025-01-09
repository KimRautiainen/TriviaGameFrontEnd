import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {WebSocketContext} from '../contexts/WebsocketContext';
import LottieView from 'lottie-react-native';
import {Bar} from 'react-native-progress';

const rankImages = {
  1: require('../assets/icons/Novice.webp'),
  2: require('../assets/icons/Master.webp'),
  3: require('../assets/icons/Expert.webp'),
};

const rankRequirements = {
  1: 1000,
  2: 2000,
  3: Infinity, // No further progress for Expert
};

const RankedScreen = ({navigation}) => {
  const {user} = useContext(MainContext); // Access user data
  const {ws} = useContext(WebSocketContext); // Access WebSocket from context
  const {rankLevel, rankPoints, pointsToNextRank} = user;

  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const progress = rankPoints / pointsToNextRank;

  useEffect(() => {
    if (!ws) {
      console.error('WebSocket is not available.');
      return;
    }

    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.type === 'match_found') {
        clearTimeout(timeoutId); // Clear the matchmaking timeout
        setIsFindingMatch(false); // Stop finding match animation
        Alert.alert('Match Found!', 'Opponent Found! Starting the game.');
        navigation.navigate('RankedGameScreen', {
          gameId: message.payload.gameId,
          opponent: message.payload.opponent,
          questions: message.payload.questions,
        });
      }
    };

    ws.addEventListener('message', handleWebSocketMessage);

    return () => {
      ws.removeEventListener('message', handleWebSocketMessage);
    };
  }, [ws, navigation, timeoutId]);

  const handleFindMatch = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setIsFindingMatch(true);
      ws.send(JSON.stringify({type: 'join_matchmaking', payload: {}}));

      const id = setTimeout(() => {
        setIsFindingMatch(false);
        Alert.alert('Timeout', 'No match found within 20 seconds.');
        handleCancelMatchmaking();
      }, 20000);

      setTimeoutId(id);
    } else {
      Alert.alert('Error', 'WebSocket connection is not open.');
    }
  };

  const handleCancelMatchmaking = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({type: 'leave_matchmaking', payload: {}}));
    }
    clearTimeout(timeoutId);
    setIsFindingMatch(false);
    Alert.alert('Matchmaking Cancelled', 'You have left the matchmaking pool.');
  };

  const renderRankProgress = () => {
    const nextRankLevel = rankLevel + 1;
    const nextRankRequirement = rankRequirements[nextRankLevel] || Infinity;

    if (rankLevel === 3) return null;

    return (
      <View style={styles.rankProgressContainer}>
        <Image source={rankImages[rankLevel]} style={styles.rankImage} />
        <View style={styles.rankProgressBarContainer}>
          <Bar
            progress={rankPoints / nextRankRequirement}
            width={300}
            height={20}
            color="#4a90e2"
            unfilledColor="#ccc"
            borderWidth={0}
            borderRadius={10}
          />
        </View>
        <Text style={styles.rankProgressText}>
          {rankPoints} / {nextRankRequirement} Rank Points
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!isFindingMatch ? (
        <>
          <Text style={styles.header}>Ranked Game Mode</Text>
          <Text style={styles.info}>
            Compete against other players to earn points and climb the ranks!
          </Text>

          {renderRankProgress()}

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
            onPress={handleCancelMatchmaking}
          >
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
  rankProgressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  rankProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rankImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 60,
  },
  rankProgressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
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
