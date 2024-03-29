import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import ClassicModeComponent from '../components/gameScreenComponents/ClassicModeComponent';

const GameScreen = ({navigation, route}) => {
  const gameMode = route.params.gameMode;
  console.log('Game mode:', gameMode);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {gameMode === 'Classic' && <ClassicModeComponent />}
        {gameMode === 'Timed' && (
          <Text>Welcome to Timed Mode</Text>
          // Add more content specific to Timed Mode here
        )}
        {gameMode === 'Survival' && <Text>Welcome to Survival Mode</Text>}
        {gameMode === 'Ranked' && <Text>Welcome to Ranked Mode</Text>}
        {gameMode === 'Categories' && <Text>Welcome to Categories Mode</Text>}
        {gameMode === 'Tournament' && <Text>Welcome to Tournament Mode</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
GameScreen.propTypes = {
  navigation: PropTypes.object,
};

export default GameScreen;
