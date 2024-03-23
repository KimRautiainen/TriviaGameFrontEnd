import he from 'he';

// Function to decode a single question object
export const decodeQuestion = (question) => ({
  ...question,
  question: he.decode(question.question),
  correct_answer: he.decode(question.correct_answer),
  incorrect_answers: question.incorrect_answers.map((answer) =>
    he.decode(answer),
  ),
  // Ensure the correct answer is also included in the shuffle
  answers: [
    he.decode(question.correct_answer),
    ...question.incorrect_answers.map((answer) => he.decode(answer)),
  ].sort(() => 0.5 - Math.random()),
});

// Function to decode an array of question objects
export const decodeQuestionsArray = (questions) =>
  questions.map(decodeQuestion);
