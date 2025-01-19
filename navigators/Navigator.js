import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {MusicContext} from '../contexts/MusicContext';
import HomePage from '../views/Home';
import GameModeScreen from '../views/GameModeScreen';
import GameScreen from '../views/GameScreen';
import AchievementScreen from '../views/AchievementScreen';
import ShopComponent from '../views/Shop';
import ProfileScreen from '../views/ProfileScreen';
import LeaderboardScreen from '../views/LeaderboardScreen';
import RankedScreen from '../views/RankedScreen';
import TabMenu from './TabMenu';
import {StyleSheet} from 'react-native';
import RankedGameScreen from '../views/RankedGameScreen';
import GameOverScreen from '../views/GameOverScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Tab Bar setup
const Tabscreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false, // Hide the default labels
        tabBarStyle: {...styles.tabContainer}, // Apply custom styles
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabMenu screen="Home" focused={focused} />
          ),
        }}
      />

      {/* Shop Tab */}
      <Tab.Screen
        name="Shop"
        component={ShopComponent}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabMenu screen="Shop" focused={focused} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabMenu screen="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// -- Contains all navigation logic. If user has not logged in we serve only login screen -- //
const Stackscreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  const {playMusic, stopMusic} = useContext(MusicContext); // Access MusicContext
  return (
    <Stack.Navigator
      screenListeners={{
        state: async (e) => {
          const routeName = e.data.state.routes[e.data.state.index].name;
          // Stop music on game screens, otherwise play
          if (['GameScreen', 'Login'].includes(routeName)) {
            await stopMusic();
          } else {
            await playMusic();
          }
        },
      }}
    >
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={Tabscreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GameModeScreen"
            component={GameModeScreen}
            options={{
              headerShown: true,
              title: 'Game Modes',
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="GameScreen"
            component={GameScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AchievementScreen"
            component={AchievementScreen}
            options={{
              headerShown: true,
              title: 'Achievements',
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitleVisible: true,
            }}
          />
          <Stack.Screen
            name="LeaderboardScreen"
            component={LeaderboardScreen}
            options={{
              headerShown: true,
              title: 'Leaderboard',
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="RankedScreen"
            component={RankedScreen}
            options={{
              headerShown: true,
              title: 'Ranked',
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="RankedGameScreen"
            component={RankedGameScreen}
            options={{
              headerShown: false,
              title: 'Ranked',
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="GameOverScreen"
            component={GameOverScreen}
            options={{
              headerShown: false,
              title: 'Ranked',
              headerStyle: {
                backgroundColor: '#000000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitleVisible: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
          listeners={{
            focus: async () => {
              // Always stop the music when the Login screen is focused
              await stopMusic();
            },
          }}
        />
      )}
    </Stack.Navigator>
  );
};

// Navigation Container
const Navigator = () => {
  return (
    <NavigationContainer>
      <Stackscreen />
    </NavigationContainer>
  );
};

export default Navigator;

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    borderRadius: 30,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#B3EBF2',
  },
});
