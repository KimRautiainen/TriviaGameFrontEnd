import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';

const GameModeCard = ({title, description, imageSource, style}) => {
  return (
    <View style={[styles.gameModeContainer, style]}>
      <ImageBackground
        source={imageSource}
        style={styles.cardContainer}
        imageStyle={styles.cardBackground}
      >
        <Text style={styles.cardTitle}>{title}</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  gameModeContainer: {
    width: 350, // Wider card
    height: 130, // Taller card
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25, // Adjust spacing between cards
    borderWidth: 2, // Optional border width for card
    borderColor: '#000', // Optional border color
    borderRadius: 15, // Smooth rounded corners
    overflow: 'hidden', // Ensure content respects the rounded corners
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30, // Bigger font size for better visibility
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Subtle shadow for contrast
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  cardBackground: {
    borderRadius: 15, // Match the parent container's borderRadius
  },
});

export default GameModeCard;
