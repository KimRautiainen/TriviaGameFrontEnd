import React, {createContext, useRef} from 'react';
import {Audio} from 'expo-av';

export const SoundContext = createContext();

// -- Context for playing sound effects from different components -- //
export const SoundProvider = ({children}) => {
  const buttonPressSound = useRef();
  const closeButtonSound = useRef();
  const correctSound = useRef();
  const incorrectSound = useRef();
  const levelUpSound = useRef();

  // Click pop button sound
  const playButtonSound = async () => {
    try {
      if (!buttonPressSound.current) {
        const {sound} = await Audio.Sound.createAsync(
          require('../assets/soundEffects/clickPop.mp3'),
        );
        buttonPressSound.current = sound;
      }
      await buttonPressSound.current.replayAsync();
    } catch (error) {
      console.error('Error playing button sound:', error);
    }
  };

  // Reversed click pop button sound to indicate closing sound
  const playCloseButtonSound = async () => {
    try {
      if (!closeButtonSound.current) {
        const {sound} = await Audio.Sound.createAsync(
          require('../assets/soundEffects/closButton.mp3'),
        );
        closeButtonSound.current = sound;
      }
      await closeButtonSound.current.replayAsync();
    } catch (error) {
      console.error('Error playing close button sound:', error);
    }
  };

  // Correct answer sound for trivia game
  const playCorrectSound = async () => {
    try {
      if (!correctSound.current) {
        const {sound} = await Audio.Sound.createAsync(
          require('../assets/soundEffects/correct.mp3'),
        );
        correctSound.current = sound;
      }
      await correctSound.current.replayAsync();
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  };

  // Incorrect answer sound for trivia game
  const playIncorrectSound = async () => {
    try {
      if (!incorrectSound.current) {
        const {sound} = await Audio.Sound.createAsync(
          require('../assets/soundEffects/incorrect.mp3'),
        );
        incorrectSound.current = sound;
      }
      await incorrectSound.current.replayAsync();
    } catch (error) {
      console.error('Error playing incorrect sound:', error);
    }
  };
  // Sound for users levelup
  const playLevelUpSound = async () => {
    try {
      if (!levelUpSound.current) {
        const {sound} = await Audio.Sound.createAsync(
          require('../assets/soundEffects/levelUp2.mp3'),
        );
        levelUpSound.current = sound;
      }
      await levelUpSound.current.replayAsync();
    } catch (error) {
      console.error('Error playing incorrect sound:', error);
    }
  };

  const unloadSounds = async () => {
    try {
      if (buttonPressSound.current) {
        await buttonPressSound.current.unloadAsync();
        buttonPressSound.current = null;
      }
      if (closeButtonSound.current) {
        await closeButtonSound.current.unloadAsync();
        closeButtonSound.current = null;
      }
      if (correctSound.current) {
        await correctSound.current.unloadAsync();
        correctSound.current = null;
      }
      if (incorrectSound.current) {
        await incorrectSound.current.unloadAsync();
        incorrectSound.current = null;
      }
      if (levelUpSound.current) {
        await levelUpSound.current.unloadAsync();
        levelUpSound.current = null;
      }
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  };

  React.useEffect(() => {
    return () => {
      unloadSounds(); // Cleanup sounds on unmount
    };
  }, []);

  return (
    <SoundContext.Provider
      value={{
        playButtonSound,
        playCloseButtonSound,
        playCorrectSound,
        playIncorrectSound,
        playLevelUpSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
