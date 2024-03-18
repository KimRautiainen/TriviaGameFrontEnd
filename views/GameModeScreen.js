import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import GameModeCard from '../components/gameScreenComponents/GameModeCard';

const GameModeScreen = () => {
  const gameModes = [
    {title: 'Classic', description: 'Classic trivia mode'},
    {title: 'Timed', description: 'Answer before time runs out!'},
    {
      title: 'Survival',
      description:
        'face a continuous stream of questions and must answer correctly to proceed.',
    },
    {title: 'Ranked', description: 'Compete against other playyers'},
    {title: 'Categories', description: 'Choose a category to play'},
    {title: 'Tournament', description: 'Only one winner!'},
  ];
  return (
    <View style={styles.container}>
      <ScrollView
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
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',


  },
});
export default GameModeScreen;
