import React, {useState, useContext} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useAuthentication} from '../../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../../contexts/MainContext';
import {FontAwesome} from '@expo/vector-icons';

const LoginForm = () => {
  const {postLogin} = useAuthentication();
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const logIn = async (loginData) => {
    try {
      const loginResponse = await postLogin(loginData);

      await AsyncStorage.setItem('userToken', loginResponse.token);

      setIsLoggedIn(true);
      setUser(loginResponse.user);
    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('Error', error?.message ?? 'Login failed');
    }
  };

  const onForgotPasswordPress = () => {
    Alert.alert('Reset Password', 'Password reset functionality not implemented yet.');
  };

  return (
    <View style={styles.container}>
      {/* Email */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: {value: true, message: 'Email is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <TextInput
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[
                  styles.input,
                  errors.email ? styles.inputError : null,
                ]}
              />
              {errors.email?.message ? (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              ) : null}
            </>
          )}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            maxLength: {value: 100, message: 'Password is too long'},
            required: {value: true, message: 'Password is required'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <View style={styles.passwordRow}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password ? styles.inputError : null,
                  ]}
                />

                <TouchableOpacity
                  onPress={() => setPasswordVisible((v) => !v)}
                  style={styles.eyeButton}
                  accessibilityRole="button"
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                >
                  <FontAwesome
                    name={passwordVisible ? 'eye' : 'eye-slash'}
                    size={18}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>

              {errors.password?.message ? (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              ) : null}
            </>
          )}
        />

        <Text style={styles.forgotPasswordText} onPress={onForgotPasswordPress}>
          Forgot your password?
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(logIn)}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEFBF6',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    fontSize: 16,
    height: 50,
  },
  inputError: {
    borderColor: '#d00',
  },
  errorText: {
    marginTop: 6,
    color: '#d00',
    fontSize: 12,
  },
  passwordRow: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 44, // space for eye icon
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  button: {
    height: 50,
    backgroundColor: '#FF385C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 8,
    marginRight: 5,
  },
});

export default LoginForm;
