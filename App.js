import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

/* import LottieView from 'lottie-react-native';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
const {width, height} = Dimensions.get('window'); */

const App = () => {
  return (
    <SafeAreaProvider>
      <MainProvider>
        <Navigator />
        <StatusBar style="light" translucent backgroundColor="transparent" />
      </MainProvider>
    </SafeAreaProvider>
  );
};

/* const App = () => (
  <View style={styles.container}>
    <Text style={styles.title} bold>
      QUIZ KING
    </Text>
    <LottieView
      source={require('./assets/animations/loadingTravel.json')}
      autoPlay
      loop
      style={styles.animation}
    />
    <Text style={styles.text} bold>
      Loading...
    </Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width, // Use the full width
    height: height, // Use the full height
  },
  animation: {
    width: '100%', // Make the animation take the full width
    height: '100%', // Make the animation take the full height
    position: 'absolute', // Ensure the animation is positioned absolutely
    zIndex: -1, // Send the animation to the back
    top: 50,
  },
  text: {
    position: 'absolute', // Position text over the animation
    bottom: 50, // Position text at the bottom
    fontSize: 23,
  },
  title: {
    position: 'absolute', // Position text over the animation
    fontSize: 54,
    fontWeight: 'bold',
    top: 100,
  },
}); */

export default App;
