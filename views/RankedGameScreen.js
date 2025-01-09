import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
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

  const userAnimationRef = useRef(null);
  const opponentAnimationRef = useRef(null);

  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;

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

            // Normalize keys and parse options
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

            // Reset feedback states
            setUserAnswerCorrect(null);
            setOpponentAnswerCorrect(null);
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
    console.log('Current Question Updated:', currentQuestion);
  }, [currentQuestion]);

  useEffect(() => {
    // Fetch opponent info when component mounts
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

  const sendAnswer = (selectedAnswer) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected or ready.');
      return;
    }

    console.log('Current Question Debug:', currentQuestion);

    // Validate the current question
    if (!currentQuestion || typeof currentQuestion.order === 'undefined') {
      console.error('Invalid current question:', currentQuestion);
      return;
    }

    const message = {
      type: 'answer_question',
      payload: {
        gameId,
        questionOrder: currentQuestion.order, // Ensure the key aligns with the backend
        answer: selectedAnswer,
      },
    };

    console.log('Sending WebSocket answer message:', message);

    try {
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending answer message:', error.message);
    }
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

    // Determine current user's position
    if (scores.player1Id === user.userId) {
      setUserScore(scores.player1Score);
      setOpponentScore(scores.player2Score);
    } else if (scores.player2Id === user.userId) {
      setUserScore(scores.player2Score);
      setOpponentScore(scores.player1Score);
    } else {
      console.error('Current user ID does not match player1Id or player2Id');
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
        <View style={styles.playerContainer}>
          <Image source={{uri: userAvatarUri}} style={styles.avatar} />
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
          <Text style={styles.playerScore}>{userScore}</Text>
          <Text style={styles.playerName}>{user.username}</Text>
        </View>

        <View style={styles.playerContainer}>
          {opponentData && (
            <>
              <Image
                source={{uri: `${mediaUrl}${opponentData.userAvatar}`}}
                style={styles.avatar}
              />
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
              <Text style={styles.playerScore}>{opponentScore}</Text>
              <Text style={styles.playerName}>{opponentData.username}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
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
  },
  playerContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  feedbackAnimation: {
    width: 50,
    height: 50,
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
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  optionsContainer: {
    padding: 20,
  },
  answerCard: {
    padding: 15,
    marginBottom: 15,
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
});

export default RankedGameScreen;
