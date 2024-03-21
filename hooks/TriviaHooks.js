import {doFetch} from '../utils/functions';
import {triviaUrl, categoryUrl} from '../utils/app-config';

const useTrivia = () => {
  const getQuestionsWithParams = async (amount, category, difficulty, type) => {
    const url = `${triviaUrl}amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
    return await doFetch(url);
  };
  const getRandomQuestions = async (amount) => {
    const url = `${triviaUrl}amount=${amount}`;
    return await doFetch(url);
  };
  const getCategories = async () => {
    const url = categoryUrl;
    return await doFetch(url);
  };

  return {getQuestionsWithParams, getRandomQuestions, getCategories};
};
export {useTrivia};
