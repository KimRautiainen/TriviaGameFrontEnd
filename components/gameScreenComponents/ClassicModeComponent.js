import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {useTrivia} from '../../hooks/TriviaHooks';
import {decodeQuestionsArray} from '../../utils/decodeQuestions';
import LoadingIndicator from '../sharedComponents/LoadingIndicator';
import CorrectAnswer from '../sharedComponents/CorrectAnswer';
import InCorrectAnswer from '../sharedComponents/IncorrectAnswer';
import GameCompletedComponent from '../sharedComponents/GameCompletedComponent';
import {useNavigation} from '@react-navigation/native';
import {Divider} from '@rneui/base';
import {MainContext} from '../../contexts/MainContext';
import {useUser} from '../../hooks/ApiHooks';
import {useInventory} from '../../hooks/InventoryHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SoundContext} from '../../contexts/SoundContext';

const {width, height} = Dimensions.get('window');

const ClassicModeComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const {getRandomQuestions} = useTrivia();
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const navigation = useNavigation();

  // Context and hooks
  const {user} = useContext(MainContext);
  const {playCorrectSound, playIncorrectSound} = useContext(SoundContext);
  const {awardXp} = useUser();
  const {addItemsToInventory} = useInventory();

  const hadlePlayAgain = async () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setLoading(true);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setIsCorrectAnswer(false);
    setCorrectAnswersCount(0);
    setIncorrectAnswersCount(0);
    setGameCompleted(false);
    await fetchQuestions();
  };

  useLayoutEffect(() => {
    if (gameCompleted) {
      navigation.setOptions({
        headerShown: false,
      });
    } else if (
      questions.length > 0 &&
      currentQuestionIndex < questions.length
    ) {
      const currentCategory = questions[currentQuestionIndex].category;
      navigation.setOptions({
        headerShown: true,
        headerTitle: currentCategory,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: '#1e90ff',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      });
    }
  }, [questions, currentQuestionIndex, gameCompleted, navigation]);

  const handleReturnHome = () => {
    navigation.navigate('Home');
  };

  const fetchQuestions = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await getRandomQuestions(10);
    if (response.results) {
      setQuestions(decodeQuestionsArray(response.results));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const answerProcessingRef = useRef(false);

  const handleAnswerSelection = async (answer) => {
    // Prevent multiple triggers
    if (answerProcessingRef.current) return;
    answerProcessingRef.current = true;

    const isCorrect = answer === questions[currentQuestionIndex].correct_answer;
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      playCorrectSound().then(() => {
        setCorrectAnswersCount((prevCount) => prevCount + 1);
      });
    } else {
      playIncorrectSound().then(() => {
        setIncorrectAnswersCount((prevCount) => prevCount + 1);
      });
    }

    setTimeout(() => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      setIsCorrectAnswer(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setGameCompleted(true);
        awardXpAfterGameCompletion();
        addItemsToInventoryAfterGameCompletion();
      }
      answerProcessingRef.current = false; // Allow further processing
    }, 2000);
  };

  const awardXpAfterGameCompletion = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const xp = correctAnswersCount * 111; // Calculate XP
        const userId = user.userId;

        // Award XP
        const response = await awardXp(token, xp, userId);

        if (response) {
          // Optionally, you can log success or update any local XP value
          console.log(`Successfully awarded ${xp} XP to user ${userId}`);
        }
      }
    } catch (error) {
      console.log('Error awarding XP:', error);
    }
  };

  const addItemsToInventoryAfterGameCompletion = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const items = {goldCoins: correctAnswersCount * 8};
        await addItemsToInventory(items, token);
      }
    } catch (error) {
      console.log('Error adding items to inventory');
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (gameCompleted) {
    return (
      <GameCompletedComponent
        correctAnswers={correctAnswersCount}
        incorrectAnswers={incorrectAnswersCount}
        goldCoins={correctAnswersCount * 8}
        experiencePoints={correctAnswersCount * 11}
        onPlayAgain={hadlePlayAgain}
        onReturnHome={handleReturnHome}
      />
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/quizBackground.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={{flex: 1}}>
        {showAnswer &&
          (isCorrectAnswer ? <CorrectAnswer /> : <InCorrectAnswer />)}
        <ScrollView
          style={styles.container}
          contentContainerStyle={{flexGrow: 1}}
        >
          {questions.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.questionCount}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <Divider />
              <Text style={styles.questionText}>
                {questions[currentQuestionIndex].question}
              </Text>
            </View>
          )}
          <View style={styles.answerTextContainer}>
            {questions.length > 0 &&
              questions[currentQuestionIndex].answers.map((answer, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.answerCard,
                    showAnswer
                      ? answer ===
                        questions[currentQuestionIndex].correct_answer
                        ? styles.correctAnswer
                        : selectedAnswer === answer
                          ? styles.wrongAnswer
                          : {}
                      : {},
                  ]}
                  onPress={() => handleAnswerSelection(answer)}
                  disabled={showAnswer}
                >
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  card: {
    width: '100%',
    top: 80,
    minHeight: 250,
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1.8)',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  questionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    color: '#3b5998',
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
  },
  answerTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  answerCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 30,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    color: '#333',
  },
});

export default ClassicModeComponent;
