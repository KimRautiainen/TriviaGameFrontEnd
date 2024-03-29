import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

const CorrectAnswer = () => (
  <LottieView
    source={require('../../assets/animations/correct.json')}
    autoPlay
    style={styles.animation}
  />
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width, // Use the full width
    height: height, // Use the full height
  },
  animation: {
    width: '100%', // Make the animation take the full width
    height: '100%', // Make the animation take the full height
    alignSelf: 'center', // Center the animation
    position: 'absolute', // Ensure the animation is positioned absolutely
    zIndex: 1, // Send the animation to the back
    top: 30,
  },
});
export default CorrectAnswer;
