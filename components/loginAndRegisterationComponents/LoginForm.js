import React, {useState} from 'react';
import {Alert, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useAuthentication} from '../../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../../contexts/MainContext';
import {Input, Button, Icon} from '@rneui/themed';

// LoginForm Component for User Authentication
const LoginForm = () => {
  // Fetching login function from ApiHooks
  const {postLogin} = useAuthentication();

  // Accessing the application's global state through MainContext
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // Setting up form controls and validation using react-hook-form
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Function to handle user login
  const logIn = async (loginData) => {
    try {
      console.log('Login data:', loginData);  // Check form data being sent

      // Make the API call to login
      const loginResponse = await postLogin(loginData);
      console.log('Login response:', loginResponse);  // Check API response

      // Store the token in AsyncStorage
      await AsyncStorage.setItem('userToken', loginResponse.token);

      // Update the app state
      setIsLoggedIn(true);
      setUser(loginResponse.user);
    } catch (error) {
      console.log('Login Error:', error);  // Log the error message
      Alert.alert('Error', error.message);
    }
  };

  const onForgotPasswordPress = () => {
    // Placeholder for now, you can replace this with navigation or other logic
    Alert.alert(
      'Reset Password',
      'Password reset functionality not implemented yet.',
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Email is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.username?.message}
              inputStyle={styles.input}
            />
          )}
          name="email"
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
              secureTextEntry={!passwordVisible}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
              inputStyle={styles.input}
              rightIcon={
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Icon
                    name={passwordVisible ? 'eye' : 'eye-slash'}
                    type="font-awesome"
                  />
                </TouchableOpacity>
              }
            />
          )}
          name="password"
        />
        <Text style={styles.forgotPasswordText} onPress={onForgotPasswordPress}>
          Forgot your password?
        </Text>
      </View>

      <Button
        title="Log In"
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
    backgroundColor: '"FEFBF6',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    fontSize: 16,
    height: 50,
  },
  button: {
    height: 50,
    backgroundColor: '#FF385C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  forgotPasswordText: {
    alignSelf: 'flex-end', 
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 5,
    marginBottom: 5,
  },
});

export default LoginForm;
