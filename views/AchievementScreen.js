import {Text} from '@rneui/themed';
import React, {useState} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import AchievementsComponent from '../components/achievementScreenComponents/achievementsComponent';

const AchievementScreen = ({navigation, route}) => {
  return (
    <View>
      <AchievementsComponent />
    </View>
  );
};
AchievementScreen.propTypes = {
  navigation: PropTypes.object,
};
export default AchievementScreen;
