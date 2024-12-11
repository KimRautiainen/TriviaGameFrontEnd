import React, {createContext, useRef} from 'react';
import {Audio} from 'expo-av';

export const SoundContext = createContext();

export const SoundProvider = ({children}) => {
  const buttonPressSound = useRef();

  const playButtonSound = async () => {
    try {
      if (!buttonPressSound.current) {
        const {sound} = await Audio.Sound.createAsync(
          require('../assets/soundEffects/clickPop.mp3'), // Replace with your button click sound
        );
        buttonPressSound.current = sound;
      }
      await buttonPressSound.current.replayAsync();
    } catch (error) {
      console.error('Error playing button sound:', error);
    }
  };

  const unloadSounds = async () => {
    if (buttonPressSound.current) {
      await buttonPressSound.current.unloadAsync();
      buttonPressSound.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      unloadSounds(); // Cleanup sounds on unmount
    };
  }, []);

  return (
    <SoundContext.Provider value={{playButtonSound}}>
      {children}
    </SoundContext.Provider>
  );
};
