// views/HomePage.js
import React, {useContext, useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserProfile from '../components/homeScreenComponents/UserProfile';
import GameModeCard from '../components/homeScreenComponents/GameModeCard';
import Inventory from '../components/homeScreenComponents/inventory';

const HomePage = () => {
  const gameModes = [
    {title: 'Classic', description: 'Classic trivia mode'},
    {title: 'Timed', description: 'Answer before time runs out!'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <UserProfile />
      <Inventory />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gameModesScrollView}
      >
        {gameModes.map((mode, index) => (
          <GameModeCard
            key={index}
            title={mode.title}
            description={mode.description}
          />
        ))}
      </ScrollView>
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
});

export default HomePage;
