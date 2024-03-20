import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import {useTrivia} from '../../hooks/TriviaHooks';

const ClassicModeComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const {getRandomQuestions} = useTrivia();

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await getRandomQuestions(10);
      if (response.results) {
        const decodedQuestions = response.results.map((q) => ({
          ...q,
          question: decodeURIComponent(q.question),
          correct_answer: decodeURIComponent(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((answer) =>
            decodeURIComponent(answer),
          ),
          answers: [q.correct_answer, ...q.incorrect_answers].sort(
            () => Math.random() - 0.5,
          ), // Shuffle answers
        }));
        setQuestions(decodedQuestions);
      }
    };
    fetchQuestions();
  }, []);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(
      (prevIndex) => (prevIndex + 1 < questions.length ? prevIndex + 1 : 0), // Loop back to the first question
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Classic Mode</Text>
      {questions.length > 0 && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex].question}
          </Text>
          {questions[currentQuestionIndex].answers.map((answer, idx) => (
            <Button key={idx} title={answer} onPress={() => {}} /> // Here you can add functionality to handle answer selection
          ))}
          <View style={styles.nextButton}>
            <Button title="Next Question" onPress={handleNextQuestion} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  nextButton: {
    marginTop: 20,
  },
});

export default ClassicModeComponent;
