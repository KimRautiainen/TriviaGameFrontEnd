import React, {useEffect, useState, useLayoutEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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

const ClassicModeComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const {getRandomQuestions} = useTrivia();
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const navigation = useNavigation();

  // Context and hooks
  const {user} = useContext(MainContext); // Get user from MainContext
  const {awardXp} = useUser(); // Get the awardXp function from the useUser hook
  const {addItemsToInventory} = useInventory(); // Get the addItemsToInventory function from the useInventory hook

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
    // If the game is completed, hide the header
    if (gameCompleted) {
      navigation.setOptions({
        headerShown: false,
      });
    } else if (
      questions.length > 0 &&
      currentQuestionIndex < questions.length
    ) {
      // If the game is not completed and questions are available, show the header with the current category
      const currentCategory = questions[currentQuestionIndex].category;
      navigation.setOptions({
        headerShown: true,
        headerTitle: currentCategory,
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
    // Navigate to home screen
    navigation.navigate('Home');
  };

  // Fetch questions from the API
  const fetchQuestions = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    const response = await getRandomQuestions(10);
    if (response.results) {
      setQuestions(decodeQuestionsArray(response.results));
      setLoading(false);
    }
  };

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []); // Dependencies remain empty for initial load

  // Handle answer selection
  const handleAnswerSelection = (answer) => {
    const isCorrect = answer === questions[currentQuestionIndex].correct_answer;
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setIsCorrectAnswer(isCorrect); // Set correct answer state

    // Update correct/incorrect counts
    if (isCorrect) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    } else {
      setIncorrectAnswersCount((prevCount) => prevCount + 1);
    }

    // Move to the next question after 2 seconds
    setTimeout(() => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      setIsCorrectAnswer(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        // Set game state to completed and award user rewards
        setGameCompleted(true);
        // Award XP after the game is completed
        awardXpAfterGameCompletion();
        // Award goldcoins after game is completed
        addItemsToInventoryAfterGameCompletion();
      }
    }, 2000);
  };

  // Function to award Xp after game is completed
  const awardXpAfterGameCompletion = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const xp = correctAnswersCount * 11;
        const userId = user.userId;
        console.log('EXP: ', xp);

        const response = await awardXp(token, xp, userId);
        if (response) {
          console.log(`Successfully awarded ${xp} XP to user ${userId}`);
        } else {
          console.log(`Failed to award ${xp} XP to user ${userId}`);
        }
      }
    } catch (error) {
      console.log('Error awarding xp');
    }
  };
  // Function to add items to inventory after game is completed
  const addItemsToInventoryAfterGameCompletion = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const items = {
          goldCoins: correctAnswersCount * 8,
        };
        const response = await addItemsToInventory(items, token);
        if (response) {
          console.log(
            `Successfully added ${correctAnswersCount * 8} gold coins to inventory`,
          );
        } else {
          console.log(
            `Failed to add ${correctAnswersCount * 8} gold coins to inventory`,
          );
        }
      }
    } catch (error) {
      console.log('Error adding items to inventory');
    }
  };

  // Show loading screen if loading is true
  if (loading) {
    return <LoadingIndicator />;
  }
  // Show game completed screen if game is completed
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

  // Show the game screen
  return (
    <View style={{flex: 1}}>
      {showAnswer &&
        (isCorrectAnswer ? <CorrectAnswer /> : <InCorrectAnswer />)}
      <ScrollView style={styles.container}>
        {/*  <Text style={styles.title}>Classic Mode</Text> */}
        {questions.length > 0 && (
          <View style={styles.card}>
            {/* Display the question count here */}
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
                    ? answer === questions[currentQuestionIndex].correct_answer
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    // backgroundColor: '#BEE1E6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute', // Position it absolutely within the card
    top: 10, // Adjust as needed to position correctly within the card
    alignSelf: 'center', // Center it horizontally
    color: '#3b5998', // Example color, adjust as needed
  },
  card: {
    // Increase the size of the question card
    width: '100%', // Adjust based on your needs
    minWidth: '100%', // Added minWidth to prevent 'width' from being '0
    minHeight: 250,
    padding: 20,
    marginBottom: 120, // Added more margin-bottom for separation
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center', // Ensure the content is centered
    alignItems: 'center', // Center content horizontally
    paddingTop: 40, // Added paddingTop to ensure space for the question count
    position: 'relative', // Ensure the question count is positioned correctly
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center', // Center text for better readability
  },
  answerTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  answerCard: {
    // Fixed size for answer cards to prevent flickering
    //minHeight: 20, // Adjust based on your needs
    padding: 15,
    marginBottom: 15,
    borderRadius: 30,
    elevation: 5,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    backgroundColor: 'white', // Light grey background
  },
  correctAnswer: {
    backgroundColor: '#a5d6a7',
  },
  wrongAnswer: {
    backgroundColor: '#ef9a9a',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center', // Center text for better readability
    color: '#333', // Darker text for better readability on pastel backgrounds
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statsText: {
    fontSize: 20,
    margin: 10,
  },
});

export default ClassicModeComponent;
