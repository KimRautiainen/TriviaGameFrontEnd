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
  goldCoins,
  experiencePoints,
  onPlayAgain,
  onReturnHome,
}) => (
  <View style={styles.statsContainer}>
    <Text style={styles.title}>Quiz Completed!</Text>

    {/* Correct Answers Section Updated */}
    <Text style={styles.correctAnswersText}>
      Correct Answers: {correctAnswers} / {incorrectAnswers + correctAnswers}
    </Text>

    <LottieView
      source={require('../../assets/animations/trophy.json')}
      autoPlay
      loop={false}
      style={styles.animation}
    />

    {/* Updated Rewards Section with Title */}
    <Text style={styles.rewardsTitle}>Rewards</Text>
    <View style={styles.rewardsContainer}>
      <View style={styles.rewardRow}>
        {/* Gold Coins */}
        <View style={styles.individualRewardContainer}>
          <LottieView
            source={require('../../assets/animations/goldCoin.json')}
            autoPlay
            loop={true}
            style={styles.rewardAnimation}
          />
          <Text style={styles.rewardsText}>{goldCoins} Coins</Text>
        </View>

        {/* Experience Points */}
        <View style={styles.individualRewardContainer}>
          <LottieView
            source={require('../../assets/animations/xpBadge.json')}
            autoPlay
            loop={true}
            style={styles.rewardAnimation}
          />
          <Text style={styles.rewardsText}>{experiencePoints} XP</Text>
        </View>
      </View>
    </View>

    {/* Buttons for Actions */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onReturnHome}>
        <Text style={styles.buttonText}>Return Home</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  animation: {
    width: 300,
    height: 260,
    alignSelf: 'center',
    marginTop: 20, // Adjusted to align properly under the title
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Changed to align items from the top
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, // Added padding at the top to ensure the title is visible
    paddingBottom: 10,
    width: '100%',
  },
  statsText: {
    fontSize: 20,
    marginVertical: 10, // Adjusted to provide spacing above and below
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute', // Adjusted positioning
    top: 10, // Position the title at the top within the container
    alignSelf: 'center', // Center the title horizontally
  },
  button: {
    backgroundColor: '#4c669f',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: Dimensions.get('window').width * 0.8, // Adjusted width
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute', // Position the buttons absolutely
    bottom: 10, // Position the buttons at the bottom of the container
    width: '100%',
    alignItems: 'center',
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  rewardsText: {
    marginTop: 5, // Space between animation and text
    fontSize: 16,
    fontWeight: 'bold', // Make text bold
  },
  rewardsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20, // Add some space above the title
    marginBottom: 10, // And a little less below, before the rewards start
    color: '#4c669f', // Optional: Match this with your app's theme or button color
  },
  rewardAnimation: {
    width: 80, // Smaller animations
    height: 80,
    alignSelf: 'center',
  },
  smallRewardAnimation: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  individualRewardContainer: {
    alignItems: 'center',
    marginHorizontal: 20, // Space between rewards
  },
  correctAnswersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Optional: Change the color to make it stand out or match your theme
    marginTop: 15, // Ensure some space above this text
    marginBottom: -20, // Pull the trophy animation closer to the text
  },
});
GameCompletedComponent.propTypes = {
  correctAnswers: PropTypes.number.isRequired,
  incorrectAnswers: PropTypes.number.isRequired,
  goldCoins: PropTypes.number.isRequired, // New prop for gold coins
  experiencePoints: PropTypes.number.isRequired, // New prop for experience points
  onPlayAgain: PropTypes.func.isRequired,
  onReturnHome: PropTypes.func.isRequired,
};
export default GameCompletedComponent;
