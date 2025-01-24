import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {WebSocketContext} from '../contexts/WebsocketContext';
import {mediaUrl} from '../utils/app-config';
import LottieView from 'lottie-react-native';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

const RankedGameScreen = ({route, navigation}) => {
  const {user} = useContext(MainContext);
  const {ws} = useContext(WebSocketContext);
  const {gameId, opponent, questions} = route.params;
  const {getUserById} = useUser();

  const [opponentData, setOpponentData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswerCorrect, setUserAnswerCorrect] = useState(null);
  const [opponentAnswerCorrect, setOpponentAnswerCorrect] = useState(null);
  const [timer, setTimer] = useState(30);
  const [opponentConnected, setOpponentConnected] = useState(true);
  const [disconnectTimer, setDisconnectTimer] = useState(0);
  const disconnectTimerRef = useRef(null);
  const userAnimationRef = useRef(null);
  const opponentAnimationRef = useRef(null);

  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;
  const opponentAvatarUri = `${mediaUrl}${opponentData?.userAvatar}`;

  // Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Assign handlers for different messages
  useEffect(() => {
    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      switch (message.type) {
        case 'answer_feedback': // feedback when user submits answer
          handleAnswerFeedback(message.payload);
          break;
        case 'score_update': // Score update when user submits answer
          updateScores(message.payload);
          break;
        case 'next_question': // After both users have answered, server gives next question
          handleNextQuestion(message.payload);
          break;
        case 'game_ended': // All questions are answered and game is completed
          handleGameEnd(message.payload);
          break;
        case 'player_disconnected': // Websocket connection is disconnected
          handlePlayerDisconnected(message.payload);
          break;
        case 'player_reconnected': // Websocket connection is reconnected
          handlePlayerReconnected(message.payload);
          break;
        default:
          console.log('Unknown message type:', message.type); // Handle uknown message from server
      }
    };

    ws.addEventListener('message', handleWebSocketMessage); // Listen for messages

    return () => {
      ws.removeEventListener('message', handleWebSocketMessage);
      if (disconnectTimerRef.current) {
        clearInterval(disconnectTimerRef.current);
      }
    };
  }, [ws]);

  // Fetch opponent data when component mounts
  useEffect(() => {
    fetchOpponentData();
  }, []);

  // Fetch opponent data when component mounts
  const fetchOpponentData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token available.');
      const response = await getUserById(opponent, token);
      if (response) {
        setOpponentData(response);
      } else {
        console.warn('Opponent data is empty or invalid.');
        setOpponentData(null); // Fallback to null
      }
    } catch (error) {
      console.error('Error fetching opponent data:', error.message);
      Alert.alert('Error', 'Failed to fetch opponent data.');
      setOpponentData(null); // Fallback to null
    }
  };

  // Send users quiz answer to server
  const sendAnswer = (answer) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || showAnswer) {
      return;
    }

    // update states
    setSelectedAnswer(answer);
    setShowAnswer(true);

    // form message
    const message = {
      type: 'answer_question',
      payload: {
        gameId,
        questionOrder: currentQuestion.order,
        answer,
      },
    };

    ws.send(JSON.stringify(message));
  };

  // Handle answer feedback
  const handleAnswerFeedback = ({userId, isCorrect}) => {
    if (userId === user.userId) {
      setUserAnswerCorrect(isCorrect);
      userAnimationRef.current?.play(); // Show animation whether its correct or incorrect
    } else {
      setOpponentAnswerCorrect(isCorrect);
      opponentAnimationRef.current?.play();
    }
  };

  // update scores to show correct answers count on players
  const updateScores = (payload) => {
    const {scores} = payload;

    // assign scores to right players
    if (scores.player1Id === user.userId) {
      setUserScore(scores.player1Score);
      setOpponentScore(scores.player2Score);
    } else if (scores.player2Id === user.userId) {
      setUserScore(scores.player2Score);
      setOpponentScore(scores.player1Score);
    }
  };
  // Handle when server sends next quiz question
  const handleNextQuestion = (payload) => {
    if (payload && payload.question) {
      const nextQuestion = payload.question;

      nextQuestion.order = nextQuestion.questionOrder;

      // Ensure options are properly parsed if they are a string
      if (typeof nextQuestion.options === 'string') {
        try {
          nextQuestion.options = JSON.parse(nextQuestion.options);
        } catch (error) {
          console.error('Error parsing options:', error.message);
          nextQuestion.options = [];
        }
      }

      // Reset states for next round
      setCurrentQuestion(nextQuestion);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setUserAnswerCorrect(null);
      setOpponentAnswerCorrect(null);
      setTimer(30); // Reset timer for the next question
    } else {
      console.error('Invalid next_question payload:', payload);
    }
  };

  // Handle when player disconnects from websocket
  const handlePlayerDisconnected = ({opponentId}) => {
    setOpponentConnected(false);
    setDisconnectTimer(30); // Start countdown from 30 seconds

    // Clear any existing timer
    if (disconnectTimerRef.current) {
      clearInterval(disconnectTimerRef.current);
    }

    // Start countdown timer
    disconnectTimerRef.current = setInterval(() => {
      setDisconnectTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          clearInterval(disconnectTimerRef.current);
          disconnectTimerRef.current = null;
          return 0;
        }
      });
    }, 1000);
  };

  // Handler when player reconnects to game
  const handlePlayerReconnected = ({opponentId}) => {
    setOpponentConnected(true);
    setDisconnectTimer(0);

    // Clear the disconnect timer
    if (disconnectTimerRef.current) {
      clearInterval(disconnectTimerRef.current);
      disconnectTimerRef.current = null;
    }
  };

  // Handle logic for when game ends
  const handleGameEnd = (payload) => {
    const {winner, scores} = payload;

    const winnerUsername =
      winner === user.userId ? user.username : opponentData?.username;

    // navigate to game over screen and send data payload
    navigation.replace('GameOverScreen', {
      winnerUsername,
      player1Username: user.username,
      player2Username: opponentData?.username,
      scores,
    });
  };

  return (
    <ImageBackground
      source={require('../assets/images/quizBackground.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {!opponentConnected && (
        <View style={styles.opponentDisconnectedContainer}>
          <Text style={styles.opponentDisconnectedText}>
            Opponent disconnected. Waiting for reconnection ({disconnectTimer}
            s)...
          </Text>
        </View>
      )}
      <View style={styles.overlay} />
      <View style={styles.playerInfoContainer}>
        {/* User Container */}
        <View style={styles.playerContainer}>
          <Image source={{uri: userAvatarUri}} style={styles.avatar} />
          <View style={styles.animationContainerUser}>
            {userAnswerCorrect !== null && (
              <LottieView
                ref={userAnimationRef}
                source={
                  userAnswerCorrect
                    ? require('../assets/animations/correct.json')
                    : require('../assets/animations/incorrect.json')
                }
                style={styles.feedbackAnimation}
                loop={false}
              />
            )}
          </View>
          <Text style={styles.playerName}>{user.username}</Text>
          <Text style={styles.playerScore}>{userScore}</Text>
        </View>

        {/* Opponent Container */}
        <View style={styles.playerContainer}>
          {opponentData ? (
            <>
              <Image
                source={
                  opponentAvatarUri
                    ? {uri: opponentAvatarUri}
                    : require('../assets/avatar.png')
                }
                style={styles.avatar}
              />
            </>
          ) : (
            <Text style={styles.loadingText}>Loading Opponent...</Text>
          )}
          <View style={styles.animationContainerOpponent}>
            {opponentAnswerCorrect !== null && (
              <LottieView
                ref={opponentAnimationRef}
                source={
                  opponentAnswerCorrect
                    ? require('../assets/animations/correct.json')
                    : require('../assets/animations/incorrect.json')
                }
                style={styles.feedbackAnimation}
                loop={false}
              />
            )}
          </View>
          <Text style={styles.playerName}>{opponentData?.username}</Text>
          <Text style={styles.playerScore}>{opponentScore}</Text>
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionCount}>
          Question {currentQuestion.order + 1} / {questions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <Text style={styles.questionCategory}>
          Category: {currentQuestion.category.replace(/_/g, ' ')}
        </Text>
        {/* Timer */}
        <View style={styles.timerContainer}>
          <Icon name="clock-o" size={20} color="#555" />
          <Text style={styles.timerText}>{timer}s</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerCard,
              showAnswer &&
                (option === currentQuestion.correctAnswer
                  ? styles.correctAnswer
                  : selectedAnswer === option
                    ? styles.wrongAnswer
                    : {}),
            ]}
            onPress={() => sendAnswer(option)}
            disabled={showAnswer}
          >
            <Text
              style={[
                styles.answerText,
                {fontSize: option.length > 50 ? 14 : 16}, // Smaller font for longer text
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playerInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
  },
  playerContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  playerScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerName: {
    fontSize: 16,
    color: '#fff',
  },
  questionCard: {
    backgroundColor: '#fff',
    position: 'absolute',
    minHeight: 250,
    top: height * 0.3,
    left: 20,
    right: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionCount: {
    position: 'absolute',
    top: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginVertical: 15,
  },
  questionCategory: {
    position: 'absolute',
    bottom: 10,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  answerCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 5,
  },
  correctAnswer: {
    backgroundColor: '#a5d6a7',
  },
  wrongAnswer: {
    backgroundColor: '#ef9a9a',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
  animationContainerUser: {
    position: 'absolute',
    right: -60, 
    top: 15,
  },
  animationContainerOpponent: {
    position: 'absolute',
    left: -60,
    top: 15,
  },
  feedbackAnimation: {
    width: 50,
    height: 50,
  },
  opponentDisconnectedContainer: {
    position: 'absolute',
    top: height * 0.231,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 69, 58, 0.9)', // Red color with transparency
    padding: 10,
    alignItems: 'center',
    zIndex: 1,
  },

  opponentDisconnectedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RankedGameScreen;
