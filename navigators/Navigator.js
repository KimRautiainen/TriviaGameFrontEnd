import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import HomePage from '../views/Home';
import GameModeScreen from '../views/GameModeScreen';
import GameScreen from '../views/GameScreen';
import AchievementScreen from '../views/AchievementScreen';
import ShopComponent from '../views/Shop';
import ProfileScreen from '../views/ProfileScreen';
import TabMenu from './TabMenu';
import {StyleSheet} from 'react-native';

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

const Stackscreen = () => {
  const {isLoggedIn} = useContext(MainContext);
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
  },
});
