import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTrivia} from '../../hooks/TriviaHooks';
import {decodeQuestionsArray} from '../../utils/decodeQuestions';
import LoadingIndicator from '../sharedComponents/LoadingIndicator';

const ClassicModeComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const {getRandomQuestions} = useTrivia();
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const response = await getRandomQuestions(10);
      setLoading(false);
      if (response.results) {
        setQuestions(decodeQuestionsArray(response.results));
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(
        (prevIndex) => (prevIndex + 1) % questions.length,
      );
    }, 2000);
  };

  // Show loading screen if loading is true
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Classic Mode</Text>
      {questions.length > 0 && (
        <View style={styles.card}>
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
  card: {
    marginBottom: 10,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
  },
  answerCard: {
    marginBottom: 10,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 5,
  },
  correctAnswer: {
    backgroundColor: 'lightgreen',
  },
  wrongAnswer: {
    backgroundColor: 'tomato',
  },
  answerText: {
    fontSize: 16,
  },
});

export default ClassicModeComponent;
