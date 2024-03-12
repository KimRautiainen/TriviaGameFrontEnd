import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from 'react-native-elements';

const GameModeCard = ({title, description}) => (
  <View style={styles.gameModeContainer}>
    <Card>
      <Card.Title>{title}</Card.Title>
      <Text>{description}</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  // Add the styles related to GameModeCard here
});

export default GameModeCard;
