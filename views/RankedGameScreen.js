import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
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

  const userAnimationRef = useRef(null);
  const opponentAnimationRef = useRef(null);

  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;

  // Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      switch (message.type) {
        case 'answer_feedback':
          handleAnswerFeedback(message.payload);
          break;
        case 'score_update':
          updateScores(message.payload);
          break;
        case 'next_question':
          if (message.payload && message.payload.question) {
            const nextQuestion = message.payload.question;

            nextQuestion.order = nextQuestion.questionOrder;
            if (typeof nextQuestion.options === 'string') {
              try {
                nextQuestion.options = JSON.parse(nextQuestion.options);
              } catch (error) {
                console.error('Error parsing options:', error.message);
                nextQuestion.options = [];
              }
            }

            setCurrentQuestion(nextQuestion);
            setShowAnswer(false);
            setSelectedAnswer(null);
            setUserAnswerCorrect(null);
            setOpponentAnswerCorrect(null);
            setTimer(30); // Reset timer for next question
          } else {
            console.error('Invalid next_question payload:', message.payload);
          }
          break;
        case 'game_ended':
          handleGameEnd(message.payload);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    ws.addEventListener('message', handleWebSocketMessage);

    return () => {
      ws.removeEventListener('message', handleWebSocketMessage);
    };
  }, [ws]);

  useEffect(() => {
    fetchOpponentData();
  }, []);

  const fetchOpponentData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await getUserById(opponent, token);
      if (response) {
        setOpponentData(response);
      } else {
        Alert.alert('Error', 'Failed to fetch opponent data.');
      }
    } catch (error) {
      console.error('Error fetching opponent data:', error.message);
    }
  };

  const sendAnswer = (answer) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || showAnswer) {
      return;
    }

    setSelectedAnswer(answer);
    setShowAnswer(true);

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

  const handleAnswerFeedback = ({userId, isCorrect}) => {
    if (userId === user.userId) {
      setUserAnswerCorrect(isCorrect);
      userAnimationRef.current?.play();
    } else {
      setOpponentAnswerCorrect(isCorrect);
      opponentAnimationRef.current?.play();
    }
  };

  const updateScores = (payload) => {
    const {scores} = payload;

    if (scores.player1Id === user.userId) {
      setUserScore(scores.player1Score);
      setOpponentScore(scores.player2Score);
    } else if (scores.player2Id === user.userId) {
      setUserScore(scores.player2Score);
      setOpponentScore(scores.player1Score);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/quizBackground.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
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
          <Image
            source={{uri: `${mediaUrl}${opponentData.userAvatar}`}}
            style={styles.avatar}
          />
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
          Question {currentQuestion.order} / {questions.length}
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
            <Text style={styles.answerText}>{option}</Text>
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
    right: -60, // Adjust as needed for alignment
    top: 15,
  },
  animationContainerOpponent: {
    position: 'absolute',
    left: -60, // Adjust as needed for alignment
    top: 15,
  },
  feedbackAnimation: {
    width: 50,
    height: 50,
  },
});

export default RankedGameScreen;
