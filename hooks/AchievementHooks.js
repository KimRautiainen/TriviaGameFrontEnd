import {triviaUrl, apiUrl, authUrl, mediaUrl} from '../utils/app-config';
import {doFetch} from '../utils/functions';

const useAchievements = () => {
  // get all achievements from database
  const getAchievements = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(apiUrl + 'achievements', options);
  };
  // get users earned achievements
  const getAchievementsByUser = async (id, token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(apiUrl + 'user/' + id + '/userAchievements', options);
  };

  // fetch progress of specific achievement for user
  const getAchievementProgress = async (id, achievementId, token) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(
      apiUrl + 'user/' + id + '/achievements/' + achievementId + '/progress',
      options,
    );
  };
  // update user achievement progress
  const updateAchievementProgress = async (id, achievementId, data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    return await doFetch(
      apiUrl + 'user/' + id + '/achievements/' + achievementId + '/progress',
      options,
    );
  };
  // complete achievement
  const completeAchievement = async (id, achievementId, token) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await doFetch(
      apiUrl + 'user/' + id + '/achievements/' + achievementId + '/complete',
      options,
    );
  };

  return {
    getAchievements,
    getAchievementsByUser,
    getAchievementProgress,
    updateAchievementProgress,
    completeAchievement,
  };
};

export {useAchievements};
