import React from 'react';
import {StyleSheet, Dimensions, View, Text} from 'react-native';
import LottieView from 'lottie-react-native';



const InCorrectAnswer = () => (
  <LottieView
    source={require('../../assets/animations/incorrect.json')}
    autoPlay
    style={styles.animation}
  />
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  animation: {
    width: '100%', // Make the animation take the full width
    height: '100%', // Make the animation take the full height */
    position: 'absolute', // Ensure the animation is positioned absolutely
    zIndex: 1, // Send the animation to the back
    top: 50,
  },
  text: {
    position: 'absolute', // Position text over the animation
    bottom: 50, // Position text at the bottom
    fontSize: 23,
    zIndex: 1,
  },
});
export default InCorrectAnswer;
