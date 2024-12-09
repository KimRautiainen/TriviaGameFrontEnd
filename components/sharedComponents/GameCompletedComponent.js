import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
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
  <>
    <ImageBackground
      source={require('../../assets/images/treasureChest.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.statsContainer}>
        <Text style={styles.title}>Quiz Completed!</Text>

        <Text style={styles.correctAnswersText}>
          Correct Answers: {correctAnswers} /{' '}
          {incorrectAnswers + correctAnswers}
        </Text>

        <LottieView
          source={require('../../assets/animations/trophy.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />

        <Text style={styles.rewardsTitle}>Rewards</Text>
        <View style={styles.rewardsContainer}>
          <View style={styles.rewardRow}>
            <View style={styles.individualRewardContainer}>
              <LottieView
                source={require('../../assets/animations/goldCoin.json')}
                autoPlay
                loop={true}
                style={styles.rewardAnimation}
              />
              <Text style={styles.rewardsText}>{goldCoins} Coins</Text>
            </View>

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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onReturnHome}>
            <Text style={styles.buttonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  </>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  animation: {
    width: 300,
    height: 260,
    alignSelf: 'center',
    marginTop: 20,
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    marginTop: 40,
  },
  correctAnswersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4c669f',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: Dimensions.get('window').width * 0.8,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  rewardsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
  rewardAnimation: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  individualRewardContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
});

GameCompletedComponent.propTypes = {
  correctAnswers: PropTypes.number.isRequired,
  incorrectAnswers: PropTypes.number.isRequired,
  goldCoins: PropTypes.number.isRequired,
  experiencePoints: PropTypes.number.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
  onReturnHome: PropTypes.func.isRequired,
};

export default GameCompletedComponent;
