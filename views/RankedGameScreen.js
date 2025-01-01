import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {mediaUrl} from '../utils/app-config';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RankedGameScreen = ({route, navigation}) => {
  const {user} = useContext(MainContext); // Access user data
  const {gameId, opponent, questions} = route.params; // Get match data

  const [opponentData, setOpponentData] = useState(null); // Store opponent info
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Timer for each question
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const {getUserById} = useUser();

  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Fetch opponent info when component mounts
    fetchOpponentData();
  }, []);

  const fetchOpponentData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await getUserById(opponent, token); // Fetch opponent info
      if (response) {
        setOpponentData(response);
      } else {
        Alert.alert('Error', 'Failed to fetch opponent data.');
      }
    } catch (error) {
      console.error('Error fetching opponent data:', error.message);
    }
  };

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const handleTimeout = () => {
    // Go to the next question on timeout
    goToNextQuestion();
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setUserScore((prevScore) => prevScore + 1);
      Alert.alert('Correct!', 'You got the answer right.');
    } else {
      Alert.alert('Wrong!', 'Better luck next time.');
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(10); // Reset timer
    } else {
      endGame();
    }
  };

  const endGame = () => {
    // Navigate to a summary or leaderboard screen
    Alert.alert(
      'Game Over',
      `Your Score: ${userScore}\nOpponent's Score: ${opponentScore}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(), // Go back to RankedScreen
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Player Info Section */}
      <View style={styles.playerInfoContainer}>
        {/* User Info */}
        <View style={styles.playerContainer}>
          <View style={styles.row}>
            <Image source={{uri: userAvatarUri}} style={styles.avatar} />
            <Text style={styles.playerScore}>{userScore}</Text>
          </View>
          <Text style={styles.playerName}>{user.username}</Text>
        </View>

        {/* Opponent Info */}
        <View style={styles.playerContainer}>
          {opponentData ? (
            <>
              <View style={styles.row}>
                <Text style={styles.playerScore}>{opponentScore}</Text>
                <Image
                  source={{uri: `${mediaUrl}${opponentData.userAvatar}`}}
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.playerName}>{opponentData.username}</Text>
            </>
          ) : (
            <Text>Loading opponent data...</Text>
          )}
        </View>
      </View>

      {/* Question Section */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  playerInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30,
  },
  playerContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  playerScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RankedGameScreen;
