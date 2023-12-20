import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useAuthentication} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {Card, Input, Button} from '@rneui/themed';

// LoginForm Component for User Authentication
const LoginForm = () => {
  // Fetching login function from ApiHooks
  const {postLogin} = useAuthentication();

  // Accessing the application's global state through MainContext
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  // Setting up form controls and validation using react-hook-form
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Function to handle user login
  const logIn = async (loginData) => {
    try {
      // Attempting to log in with provided data
      const loginResponse = await postLogin(loginData);

      // Storing the received token in AsyncStorage for future authenticated requests
      await AsyncStorage.setItem('userToken', loginResponse.token);

      // Setting the logged-in state and user details in the global context
      setIsLoggedIn(true);
      setUser(loginResponse.user);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Username is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.username?.message}
              inputStyle={styles.input}
            />
          )}
          name="username"
        />
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
            required: {value: true, message: 'Password is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
              inputStyle={styles.input}
            />
          )}
          name="password"
        />
      </View>

      <Button
        title="Submit"
        onPress={handleSubmit(logIn)}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '"FEFBF6', // or any other suitable background color
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white', // or any light shade
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD', // light gray border for the inputs
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#FF385C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default LoginForm;
