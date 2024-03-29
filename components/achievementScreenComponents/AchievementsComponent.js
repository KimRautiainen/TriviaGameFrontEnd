import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const AchievementsComponent = () => {
  return (
    <View style={styles.container}>
      <Text>Achievements Component</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AchievementsComponent;
