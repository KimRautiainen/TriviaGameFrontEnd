import {Audio} from 'expo-av';

export const playSound = async (soundFile) => {
  try {
    const {sound} = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync(); // Unload the sound when finished
      }
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
