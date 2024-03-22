import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';

const GameCompletedComponent = ({
  correctAnswers,
  incorrectAnswers,
  onPlayAgain,
  onReturnHome,
}) => (
  <View style={styles.statsContainer}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>Quiz Completed!</Text>
    </View>
    <LottieView
      source={require('../../assets/animations/trophy.json')}
      autoPlay
      loop={false}
      style={styles.animation}
    />
    {/* Container for text to ensure it appears below the animation */}
    <View style={styles.textContainer}>
      <Text style={styles.statsText}>Correct Answers: {correctAnswers}</Text>
      <Text style={styles.statsText}>
        Incorrect Answers: {incorrectAnswers}
      </Text>
    </View>
    {/* Play Again button */}
    <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
      <Text style={styles.buttonText}>Play Again</Text>
    </TouchableOpacity>
    {/* Return Home button */}
    <TouchableOpacity style={styles.button} onPress={onReturnHome}>
      <Text style={styles.buttonText}>Return Home</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  animation: {
    width: 300, // Set a fixed width
    height: 300, // Set a fixed height to control size of animation
    alignSelf: 'center', // Center the animation horizontally
    marginTop: 50, // Adjust this value to position the animation higher as desired
  },
  textContainer: {
    // A container for text to ensure it is positioned below the animation
    alignItems: 'center', // Center the text horizontally
    marginTop: 20, // Adjust spacing between the animation and the text
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statsText: {
    fontSize: 20,
    margin: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    position: 'relative',
  },
  button: {
    backgroundColor: '#4c669f',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5, // Add a little space between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
GameCompletedComponent.propTypes = {
  correctAnswers: PropTypes.number.isRequired,
  incorrectAnswers: PropTypes.number.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
  onReturnHome: PropTypes.func.isRequired,
};
export default GameCompletedComponent;
