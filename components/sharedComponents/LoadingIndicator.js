import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';

const LoadingIndicator = ({text = 'Loading...'}) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingIndicator;
