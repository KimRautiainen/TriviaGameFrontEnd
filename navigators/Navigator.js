import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';

const Stack = createNativeStackNavigator();

const Stackscreen = () => {
  // const {isLoggedIn} = useContext(MainContext);
  // const isLoggedIn = true;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
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
