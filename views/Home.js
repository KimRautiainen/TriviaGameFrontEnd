// views/HomePage.js
import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserProfile from '../components/homeScreenComponents/UserProfile';

import Inventory from '../components/homeScreenComponents/inventory';
import {Button} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Icon} from 'react-native-elements';

const HomePage = ({navigation, route}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <UserProfile />
        <Inventory />
        <TouchableOpacity
          style={styles.achievementContainer}
          onPress={() => navigation.navigate('AchievementScreen')}
        >
          <Icon
            name="trophy"
            type="font-awesome" // Specify the icon set
            color="#FFD43B"
            size={24} // Adjust size as needed
          />
        </TouchableOpacity>
        <Button
          onPress={() => navigation.navigate('GameModeScreen')}
          large
          color={'green'}
          style={styles.playButton}
        >
          Play
        </Button>
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
  achievementContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
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
HomePage.propTypes = {
  navigation: PropTypes.object,
};

export default HomePage;
