import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';

const GameInfoScreen = ({navigation, route}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text h1>GameInfoScreen</Text>
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
  playButton: {
    height: 70,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'green',
    marginBottom: 50,
  },
});
GameInfoScreen.propTypes = {
  navigation: PropTypes.object,
};

export default GameInfoScreen;
