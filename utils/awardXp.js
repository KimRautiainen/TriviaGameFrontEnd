import {useUser} from '../hooks/ApiHooks';

export const awardXpToUser = async (token, xp, userId) => {
  const {awardXp} = useUser();

  try {
    const response = await awardXp(token, xp, userId);

    if (response.ok) {
      console.log(`Successfully awarded ${xp} XP to user ${userId}`);
      return response;
    } else {
      console.error(
        `Failed to award XP to user ${userId}:`,
        response.statusText,
      );
      return null;
    }
  } catch (error) {
    console.error('Error while awarding XP:', error);
    return null;
  }
};
