import React, {useEffect, useState} from 'react';
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
        setGameCompleted(true);
      }
    }, 2000);
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
        <Text style={styles.title}>Classic Mode</Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    minHeight: 200,
    padding: 20,
    marginBottom: 80, // Added more margin-bottom for separation
    borderRadius: 8,
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
  answerCard: {
    // Fixed size for answer cards to prevent flickering
    minHeight: 60, // Adjust based on your needs
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  correctAnswer: {
    backgroundColor: 'lightgreen',
  },
  wrongAnswer: {
    backgroundColor: 'tomato',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center', // Center text for better readability
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
