import PropTypes from 'prop-types';
import React, {useContext, useEffect} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
const leaderboardScreen = ({navigation, route}) => {
  
  return (
    <ImageBackground
      source={require('../assets/images/leaderboard.png')}
      resizeMode="cover"
      style={styles.background}
    ></ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
leaderboardScreen.propTypes = {
  navigation: PropTypes.object,
};
export default leaderboardScreen;
