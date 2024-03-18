import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from 'react-native-elements';

const GameModeCard = ({title, description}) => {
  return (
    <View style={styles.gameModeContainer}>
      <Card containerStyle={styles.cardContainer}>
        <Card.Title style={styles.cardTitle}>{title}</Card.Title>
        <Text style={styles.cardDescription}>{description}</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  gameModeContainer: {
    //margin: 15,
    alignContent: 'center',
  },
  cardContainer: {
    width: 320,
    height: 100,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    borderWidth: 2,
    borderRadius: 10,
  },
  cardTitle: {
    textAlign: 'center',
  },
  cardDescription: {
    // Add styles for your description text if needed
    textAlign: 'center', // Example style
  },
});

export default GameModeCard;
