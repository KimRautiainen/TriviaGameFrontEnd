import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {MainContext} from '../contexts/MainContext';
import {SoundContext} from '../contexts/SoundContext';

const LevelUpScreen = () => {
  const {user, setShowLevelUp} = useContext(MainContext);
  const {playLevelUpSound} = useContext(SoundContext);

  useEffect(() => {
    playLevelUpSound();
  }, [playLevelUpSound]);

  // Manually close the Level Up screen
  const handleContinue = () => {
    setShowLevelUp(false);
  };

  return (
    <View style={styles.overlay}>
      <ImageBackground
        source={require('../assets/images/levelUpBackground.jpg')} // Use your background image
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Level Up!</Text>
          <Text style={styles.levelText}>You reached level {user.level}!</Text>
          <LottieView
            source={require('../assets/animations/levelUp.json')}
            autoPlay
            loop={true}
            style={styles.animation}
          />

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // Ensure the screen covers everything
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow color
    textShadowOffset: {width: 2, height: 2}, // Shadow offset
    textShadowRadius: 8, // Spread of the shadow
  },
  levelText: {
    fontSize: 25,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 8,
  },
  animation: {
    width: 200,
    height: 200,
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: '#28a745', // Green color for the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LevelUpScreen;
