import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import HomePage from '../views/Home';

const Stack = createNativeStackNavigator();

const Stackscreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  // const isLoggedIn = true;
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{headerShown: false}}
        />
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
  // setHeight tänne
  return (
    <NavigationContainer>
      <Stackscreen />
    </NavigationContainer>
  );
};

export default Navigator;
