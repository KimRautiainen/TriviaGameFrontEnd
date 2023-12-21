import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import PropTypes from 'prop-types';

const HomePage = ({navigation}) => {
  const handleStartGame = () => {
    // Navigate to the game screen
    navigation.navigate('GameScreen'); // Update with your actual game screen name
  };

  const handleGoToSettings = () => {
    // Navigate to the settings screen
    navigation.navigate('SettingsScreen'); // Update with your actual settings screen name
  };

  const handleViewHighScores = () => {
    // Navigate to the high scores screen
    navigation.navigate('HighScoresScreen'); // Update with your actual high scores screen name
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Trivia Challenge!</Text>
      <Button title="Start Game" onPress={handleStartGame} />
      <Button title="Settings" onPress={handleGoToSettings} />
      <Button title="High Scores" onPress={handleViewHighScores} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

HomePage.protoTypes = {
  navigation: PropTypes.object,
};

export default HomePage;
