import React, {useCallback, useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserProfile from '../components/homeScreenComponents/UserProfile';
import Inventory from '../components/homeScreenComponents/inventory';
import {Button} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks'; // Hook for user API
import {useInventory} from '../hooks/InventoryHooks'; // Hook for inventory API
import AsyncStorage from '@react-native-async-storage/async-storage';
import LevelUpScreen from './LevelUpScreen';

const HomePage = ({navigation, route}) => {
  const {setUser, user, setInventoryData, showLevelUp, setShowLevelUp} =
    useContext(MainContext);
  const {getUserByToken} = useUser(); // Hook to get user data
  const {getUserInventory} = useInventory(); // Hook to get inventory data

  console.log('USERDATA:', user);
  const fetchUpdatedData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Fetch user data
        const updatedUser = await getUserByToken(token);
        const newUserLevel = updatedUser.user[0].level;
        // Check if level has increased
        if (newUserLevel > user.level) {
          setUser(updatedUser.user[0]); // Update the user in context
          setShowLevelUp(true); // Trigger Level Up Screen
        }
        console.log(showLevelUp);

        setUser(updatedUser.user[0]); // Update the user in context
        console.log('USER LEVEL AFTER FUCNTION:', user.level);

        // Fetch inventory data
        const updatedInventory = await getUserInventory(token);
        setInventoryData({
          goldCoins: updatedInventory.goldCoins || 0,
          tournamentTickets: updatedInventory.tournamentTickets || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Fetch the updated user and inventory data when the screen is focused
      fetchUpdatedData();
    }, []),
  );

  return (
    <ImageBackground
      source={require('../assets/images/Quizking.png')} // Add your background image here
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <UserProfile />
          <Inventory />
          {showLevelUp && <LevelUpScreen />}
          <TouchableOpacity
            style={styles.achievementContainer}
            onPress={() => navigation.navigate('AchievementScreen')}
          >
            <Icon name="trophy" type="font-awesome" color="#FFD43B" size={24} />
          </TouchableOpacity>
          <Button
            onPress={() => navigation.navigate('GameModeScreen')}
            large
            color={'green'}
            style={styles.playButton}
          >
            Play
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  playButton: {
    height: 70,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'green',
    marginBottom: 100,
  },
});

HomePage.propTypes = {
  navigation: PropTypes.object,
};

export default HomePage;
