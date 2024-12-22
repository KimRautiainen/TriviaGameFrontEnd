import {apiUrl} from '../utils/app-config';
import {doFetch} from '../utils/functions';

const useLeaderboard = () => {
  // get leaderboards top 10 scorer
  const getLeaderboard = async () => {
    const options = {
      method: 'GET',
    };
    return await doFetch(apiUrl + 'leaderboard/getLeaderboard', options);
  };

  // Get all leaderboards for user Id
  const getLeaderboardById = async (id) => {
    const options = {
      method: 'GET',
    };
    return await doFetch(
      apiUrl + 'leaderboard/getLeaderboardById/' + id,
      options,
    );
  };

  // Get user highscores
  const getHighScore = async (id) => {
    const options = {
      method: 'GET',
    };
    return await doFetch(apiUrl + 'leaderboard/getHighscore/' + id, options);
  };

  return {
    getLeaderboard,
    getLeaderboardById,
    getHighScore,
  };
};
export {useLeaderboard};
