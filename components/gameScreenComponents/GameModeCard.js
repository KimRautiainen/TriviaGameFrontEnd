import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {Card} from 'react-native-elements';

const GameModeCard = ({title, description, imageSource}) => {
  return (
    <View style={styles.gameModeContainer}>
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
    width: 320, // Match the cardContainer's width
    height: 100, // Match the cardContainer's height
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2, // Set the border width
    borderColor: '#000', // Border color
    borderRadius: 12, // Slightly larger radius than cardBackground to ensure a smooth border
    overflow: 'hidden', // Ensures the border stays within the container
  },
  cardContainer: {
    width: '100%', // Match the parent container's width
    height: '100%', // Match the parent container's height
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    borderRadius: 10, // Rounded corners for the ImageBackground
    overflow: 'hidden', // Ensures the image respects the border radius
  },
  cardTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25, // Adjust font size as needed
    color: '#FFFFFF', // Title color
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Black shadow for contrast
    textShadowOffset: {width: -1, height: 1}, // Shadow position
    textShadowRadius: 10, // Blur radius of the shadow
  },
  cardBackground: {
    borderRadius: 10, // Match the cardContainer's borderRadius
  },
});

export default GameModeCard;
