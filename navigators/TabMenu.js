import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

const TabMenu = ({screen, focused}) => {
  let image;
  let label;

  switch (screen) {
    case 'Home':
      image = require('../assets/icons/home.png'); // Home icon
      label = 'Home'; // Text label for Home
      break;
    case 'Shop':
      image = require('../assets/icons/store.png'); // Shop icon
      label = 'Shop'; // Text label for Shop
      break;
    default:
      image = require('../assets/icons/reward.svg'); // Default icon
      label = 'Rewards'; // Default label
  }

  return (
    <View style={styles.buttonWholeContainer}>
      {focused ? (
        <View style={styles.highlightedButtonOutside}>
          <View style={styles.highlightedButton}>
            <Image source={image} style={styles.buttonImage} />
          </View>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Image source={image} style={styles.buttonImage} />
        </View>
      )}
      {/* Text label below the icon */}
      <Text style={[styles.label, focused ? styles.focusedLabel : {}]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWholeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    height: 30,
    width: 30,
  },
  highlightedButtonOutside: {
    position: 'absolute',
    padding: 5,
    borderRadius: 35,
    top: -65,
  },
  highlightedButton: {
    padding: 20,
    borderRadius: 30,
    backgroundColor: '#1E222B',
    elevation: 10,
  },
  label: {
    marginTop: 5, // Space between the icon and label
    fontSize: 12, // Small text for label
    color: '#748c94', // Default label color for inactive state
  },
  focusedLabel: {
    color: '#4CAF50', // Color for focused (active) state
  },
});

export default React.memo(TabMenu);
