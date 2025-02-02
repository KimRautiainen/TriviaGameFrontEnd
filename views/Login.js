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
import LoginForm from '../components/loginAndRegisterationComponents/LoginForm';
import RegisterForm from '../components/loginAndRegisterationComponents/RegisterForm';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser, setLoading} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [toggleRegister, setToggleRegister] = useState(false);

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  // Check if Async storage has token
  const checkToken = async () => {
    try {
      setLoading(true); // Start loading
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', token);

      if (!token) {
        console.log('No token found');
        setIsLoggedIn(false);
        return;
      }

      // Get user data with loken
      const userData = await getUserByToken(token);
      console.log('Fetched user data:', userData);

      // If userdata is found set logged in true from context and set fetched data to user
      if (userData && userData.user && userData.user.length > 0) {
        setIsLoggedIn(true);
        setUser(userData.user[0]);
      } else {
        console.log('Invalid user data structure or empty user array');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log('checkToken error:', error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false); // Data is fetched, loading is done
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
            height: deviceHeight * 0.3,
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
