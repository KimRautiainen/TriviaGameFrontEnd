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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Removed verticalAlign as it's not a valid React Native style property
    borderWidth: 2, // Set the width of the border
    borderColor: '#000', // Set the color of the border to black
    borderRadius: 12, // Slightly larger than cardContainer to create a border effect around the rounded corners
  },
  cardContainer: {
    width: 320, // Adjust width as needed
    height: 100, // Adjust height as needed
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    borderRadius: 10, // Rounded corners for the ImageBackground
    overflow: 'hidden', // Ensures the image respects the border radius
    // Note: borderWidth and borderColor are moved to gameModeContainer for the outline effect
  },
  cardTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25, // Adjust font size as needed
    color: '#FFFFFF', // Title color, adjust as needed
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Black shadow for contrast
    textShadowOffset: {width: -1, height: 1}, // Shadow position
    textShadowRadius: 10, // Blur radius of the shadow to create the outline effect
  },
  cardDescription: {
    textAlign: 'center',
    fontSize: 14, // Adjust font size as needed
    color: '#FFFFFF', // Description color, adjust as needed
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  cardBackground: {
    borderRadius: 10, // Match the outer container's borderRadius
  },
});

export default GameModeCard;
