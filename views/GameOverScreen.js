import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const GameOverScreen = ({route, navigation}) => {
  const {winnerUsername, player1Username, player2Username, scores} =
    route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game Over</Text>
      <View style={styles.winnerContainer}>
        <Text style={styles.winnerText}>🎉 Winner: {winnerUsername} 🎉</Text>
      </View>

      <View style={styles.scoresContainer}>
        <Text style={styles.scoreHeader}>Final Scores</Text>
        <Text style={styles.scoreText}>
          {player1Username}: {scores.player1Score}
        </Text>
        <Text style={styles.scoreText}>
          {player2Username}: {scores.player2Score}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}
      >
        <Text style={styles.buttonText}>Return to Main Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 40,
  },
  winnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9800',
    textAlign: 'center',
  },
  scoresContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    width: width * 0.8,
  },
  scoreHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 18,
    color: '#555',
    marginVertical: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameOverScreen;
