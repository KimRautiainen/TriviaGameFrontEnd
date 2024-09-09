import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {MainContext} from '../contexts/MainContext';

const LevelUpScreen = () => {
  const {user, setShowLevelUp} = useContext(MainContext);

  useEffect(() => {
    // Automatically hide the Level Up screen after 3 seconds
    const timer = setTimeout(() => {
      setShowLevelUp(false);
    }, 4000);

    return () => clearTimeout(timer); // Clear the timeout on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Level Up!</Text>
      <Text style={styles.levelText}>You reached level {user.level}!</Text>
      <LottieView
        source={require('../assets/animations/levelUp.json')}
        autoPlay
        loop={true}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Position it over the entire screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  levelText: {
    fontSize: 25,
    color: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default LevelUpScreen;
