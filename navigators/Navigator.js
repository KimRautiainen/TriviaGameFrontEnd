import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from '@rneui/themed';
import HomePage from '../views/Home';
import GameModeScreen from '../views/GameModeScreen';

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
    </Tab.Navigator>
  );
};

const Stackscreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  // const isLoggedIn = true;
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={Tabscreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="GameModeScreen" component={GameModeScreen} />
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
