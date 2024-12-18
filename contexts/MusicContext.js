import React, {createContext, useEffect, useRef} from 'react';
import {Audio} from 'expo-av';

export const MusicContext = createContext();

export const MusicProvider = ({children}) => {
  const backgroundMusic = useRef(null);

  const playMusic = async () => {
    try {
      if (!backgroundMusic.current) {
        const {sound} = await Audio.Sound.createAsync(
          require('../assets/music/background.mp3'),
        );
        backgroundMusic.current = sound;
        await backgroundMusic.current.setIsLoopingAsync(true);
        await backgroundMusic.current.playAsync();
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  };

  const stopMusic = async () => {
    try {
      if (backgroundMusic.current) {
        await backgroundMusic.current.stopAsync();
        await backgroundMusic.current.unloadAsync();
        backgroundMusic.current = null;
      }
    } catch (error) {
      console.error('Error stopping background music:', error);
    }
  };

  useEffect(() => {
    playMusic();
    return () => stopMusic(); // Cleanup when unmounting
  }, []);

  return (
    <MusicContext.Provider value={{playMusic, stopMusic}}>
      {children}
    </MusicContext.Provider>
  );
};
