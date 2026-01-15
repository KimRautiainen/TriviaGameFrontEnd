import React, {useState, useContext} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../../hooks/ApiHooks';
import {MainContext} from '../../contexts/MainContext';
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types';

const RegisterForm = ({setToggleRegister}) => {
  const {postUser, checkUsername} = useUser();
  const {setIsLoggedIn} = useContext(MainContext);

  const [image, setImage] = useState(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirm_password: '',
      email: '',
    },
    mode: 'onBlur',
  });

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert('Cancelled', 'No image was selected.');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Could not access the image picker.');
    }
  };

  const register = async (userData) => {
    try {
      if (!image) {
        Alert.alert('Error', 'Please select a profile picture.');
        return;
      }

      const formData = new FormData();
      formData.append('user', {
        uri: image,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      for (const key in userData) {
        if (Object.prototype.hasOwnProperty.call(userData, key)) {
          formData.append(key, userData[key]);
        }
      }

      const registerResponse = await postUser(formData, true);
      Alert.alert('Success', registerResponse.message);

      // If you want auto-login after register, do it here (optional)
      // setIsLoggedIn(true);

      setToggleRegister(false);
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        {/* Image Picker */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={selectImage} style={styles.placeholder}>
            {image ? (
              <Image source={{uri: image}} style={styles.imagePreview} />
            ) : (
              <Text style={styles.placeholderText}>Select Image</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Username */}
        <View style={styles.field}>
          <Controller
            control={control}
            name="username"
            rules={{
              required: {value: true, message: 'Username is required'},
              minLength: {value: 3, message: 'Min length is 3 characters'},
              validate: async (value) => {
                try {
                  const isAvailable = await checkUsername(value);
                  return isAvailable ? true : 'Username is already taken';
                } catch {
                  return 'Username validation failed';
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <>
                <TextInput
                  placeholder="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    errors.username ? styles.inputError : null,
                  ]}
                />
                {errors.username?.message ? (
                  <Text style={styles.errorText}>{errors.username.message}</Text>
                ) : null}
              </>
            )}
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: {value: true, message: 'Password is required'},
              minLength: {value: 5, message: 'Min length is 5 characters'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <>
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    errors.password ? styles.inputError : null,
                  ]}
                />
                {errors.password?.message ? (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                ) : null}
              </>
            )}
          />
        </View>

        {/* Confirm password */}
        <View style={styles.field}>
          <Controller
            control={control}
            name="confirm_password"
            rules={{
              required: {value: true, message: 'Password confirmation is required'},
              validate: (value) => {
                const {password} = getValues();
                return value === password ? true : 'Passwords do not match';
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <>
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    errors.confirm_password ? styles.inputError : null,
                  ]}
                />
                {errors.confirm_password?.message ? (
                  <Text style={styles.errorText}>
                    {errors.confirm_password.message}
                  </Text>
                ) : null}
              </>
            )}
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: {value: true, message: 'Email is required'},
              pattern: {
                value: /\S+@\S+\.\S+$/,
                message: 'Must be a valid email',
              },
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
                  style={[styles.input, errors.email ? styles.inputError : null]}
                />
                {errors.email?.message ? (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                ) : null}
              </>
            )}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit(register)}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  field: {
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
  button: {
    height: 50,
    backgroundColor: '#FF385C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#777',
    textAlign: 'center',
  },
});

RegisterForm.propTypes = {
  setToggleRegister: PropTypes.func,
};

export default RegisterForm;
