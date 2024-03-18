// views/HomePage.js
import React, {useContext, useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserProfile from '../components/homeScreenComponents/UserProfile';
import GameModeCard from '../components/gameScreenComponents/GameModeCard';
import Inventory from '../components/homeScreenComponents/inventory';
import {Button} from '@rneui/themed';
import PropTypes from 'prop-types';

const HomePage = ({navigation, route}) => {
  const gameModes = [
    {title: 'Classic', description: 'Classic trivia mode'},
    {title: 'Timed', description: 'Answer before time runs out!'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <UserProfile />
      <Inventory />
      <Button
        onPress={() => navigation.navigate('GameModeScreen')}
        large
        color={'green'}
        style={styles.playButton}
      >
        Play
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameModesScrollView: {
    flexDirection: 'row',
  },
  playButton: {
    height: 70,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'green',
  },
});
HomePage.propTypes = {
  navigation: PropTypes.object,
};

export default HomePage;
