import React, {useState, useContext} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../../hooks/ApiHooks';
import {MainContext} from '../../contexts/MainContext';
import {Card, Input, Button} from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import {PropTypes} from 'prop-types';

const RegisterForm = ({setToggleRegister}) => {
  const {postUser, checkUsername} = useUser();
  const {setIsLoggedIn} = useContext(MainContext);

  const [image, setImage] = useState(null); // To store the selected image

  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
    },
    mode: 'onBlur',
  });

  // Handle image selection (gallery or camera)
  const selectImage = async () => {
    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        setImage(result.assets[0].uri); // Set the selected image URI
      } else {
        Alert.alert('Cancelled', 'No image was selected.');
      }
    } catch (error) {
      console.error('Error selecting image:', error.message);
      Alert.alert('Error', 'Could not access the image picker.');
    }
  };

  // Handle form submission
  const register = async (userData) => {
    try {
      // Ensure an image is selected
      if (!image) {
        Alert.alert('Error', 'Please select a profile picture.');
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append('user', {
        uri: image,
        type: 'image/jpeg', // Adjust based on the image type
        name: 'profile.jpg', // Provide a meaningful filename
      });

      // Add other form fields to FormData
      for (const key in userData) {
        if (userData.hasOwnProperty(key)) {
          formData.append(key, userData[key]);
        }
      }

      // Make the API request with FormData
      const registerResponse = await postUser(formData, true); // Pass `true` to indicate FormData
      Alert.alert('Success', registerResponse.message);
      setToggleRegister(false);
    } catch (error) {
      console.error('Error during registration:', error.message);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Card containerStyle={styles.card}>
        <Card.Title>Register</Card.Title>

        {/* Image Picker Section */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={selectImage} style={styles.placeholder}>
            {image ? (
              <Image source={{uri: image}} style={styles.imagePreview} />
            ) : (
              <Text style={styles.placeholderText}>Select Image</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Username is required'},
            minLength: {value: 3, message: 'Min length is 3 characters'},
            validate: async (value) => {
              try {
                const isAvailable = await checkUsername(value);
                return isAvailable ? isAvailable : 'Username is already taken';
              } catch (error) {
                Alert.alert('Error', 'Username validation failed.');
              }
            },
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

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Password is required'},
            minLength: {value: 5, message: 'Min length is 5 characters'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Password"
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

        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Password confirmation is required',
            },
            validate: (value) => {
              const {password} = getValues();
              return value === password ? true : 'Passwords do not match';
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Confirm Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.confirm_password?.message}
              inputStyle={styles.input}
            />
          )}
          name="confirm_password"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Email is required'},
            pattern: {
              value: /\S+@\S+\.\S+$/,
              message: 'Must be a valid email',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
              inputStyle={styles.input}
            />
          )}
          name="email"
        />

        <Button
          title="Submit"
          onPress={handleSubmit(register)}
          buttonStyle={styles.button}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    height: 50,
    backgroundColor: '#FF385C',
    borderRadius: 10,
    marginTop: 20,
  },
  input: {},
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
