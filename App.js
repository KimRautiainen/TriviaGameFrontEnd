import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {MusicProvider} from './contexts/MusicContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaProvider>
      <MainProvider>
        <MusicProvider>
          <Navigator />
          <StatusBar style="light" translucent backgroundColor="transparent" />
          <Toast />
        </MusicProvider>
      </MainProvider>
    </SafeAreaProvider>
  );
};

export default App;
