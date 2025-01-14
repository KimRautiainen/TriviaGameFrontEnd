import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import {MusicProvider} from './contexts/MusicContext';
import {SoundProvider} from './contexts/SoundContext';
import {WebSocketProvider} from './contexts/WebsocketContext'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaProvider>
      <MainProvider>
        <WebSocketProvider>
          <MusicProvider>
            <SoundProvider>
              <Navigator />
              <StatusBar
                style="light"
                translucent
                backgroundColor="transparent"
              />
              <Toast />
            </SoundProvider>
          </MusicProvider>
        </WebSocketProvider>
      </MainProvider>
    </SafeAreaProvider>
  );
};

export default App;
