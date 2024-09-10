import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <SafeAreaProvider>
      <MainProvider>
        <Navigator />
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Toast />
      </MainProvider>
    </SafeAreaProvider>
  );
};

export default App;
