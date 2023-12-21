import React, {useContext, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Platform,
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [toggleRegister, setToggleRegister] = useState(false);

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserByToken(token);
      console.log('userdata', userData);
      if (userData) {
        setIsLoggedIn(true);
        setUser(userData);
      }
    } catch (error) {
      console.log('checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={styles.container}
      activeOpacity={1}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/logos/quiz-logo.png')}
          style={{
            width: deviceWidth,
            height: deviceHeight * 0.3, // Adjust as needed
            resizeMode: 'contain',
          }}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView>
          {toggleRegister ? (
            <RegisterForm setToggleRegister={setToggleRegister} />
          ) : (
            <LoginForm />
          )}
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {toggleRegister
              ? 'Already have an account? '
              : "Don't have an account? "}
            <Text
              style={styles.signUpText}
              onPress={() => setToggleRegister(!toggleRegister)}
            >
              {toggleRegister ? 'Login' : 'Sign up'}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFBF6',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  signUpText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default Login;
