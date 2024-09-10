import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from '@rneui/themed';
import HomePage from '../views/Home';
import GameModeScreen from '../views/GameModeScreen';
import GameScreen from '../views/GameScreen';
import AchievementScreen from '../views/AchievementScreen';
import ShopComponent from '../views/Shop';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Tabscreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: '#FFFFFF',
        headerShown: false,
        tabBarStyle: {backgroundColor: '#000000'},
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({color}) => <Icon name="home" color={color} />,
          tabBarVisible: false, // this hides the tab bar only for this screen
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopComponent}
        options={{
          tabBarIcon: ({color}) => <Icon name="shop" color={color} />,
          tabBarVisible: false, // this hides the tab bar only for this screen
        }}
      />
    </Tab.Navigator>
  );
};

const Stackscreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  // const isLoggedIn = false;
  return (
    <Stack.Navigator>
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
              headerTintColor: '#fff', // Customize header text and icons color
              headerTitleStyle: {
                fontWeight: 'bold', // Customize header title text style
              },
              headerBackTitleVisible: false, // Hide the back label text to show only the icon
              // Additional customization can be added here
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
              headerTintColor: '#fff', // Customize header text and icons color
              headerTitleStyle: {
                fontWeight: 'bold', // Customize header title text style
              },
              headerBackTitleVisible: true,
              
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stackscreen />
    </NavigationContainer>
  );
};

export default Navigator;
