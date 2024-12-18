import React, {useCallback, useContext, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
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
import {SoundContext} from '../contexts/SoundContext';
import LottieView from 'lottie-react-native';

const HomePage = ({navigation, route}) => {
  const {setUser, user, setInventoryData, showLevelUp, setShowLevelUp} =
    useContext(MainContext);
  const {getUserByToken} = useUser(); // Hook to get user data
  const {getUserInventory} = useInventory(); // Hook to get inventory data
  const {playButtonSound, playLevelUpSound} = useContext(SoundContext);

  // Animation refs for control
  const eventsAnimationRef = useRef(null);
  const questsAnimationRef = useRef(null);
  const leaderboardsAnimationRef = useRef(null);
  const achievementsAnimationRef = useRef(null);

  const handleNavigate = async (screen) => {
    await playButtonSound(); // play sound before navigating
    navigation.navigate(screen);
  };

  const fetchUpdatedData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Fetch user data
        const updatedUser = await getUserByToken(token);
        const newUserLevel = updatedUser.user[0].level;

        // Use a functional update to ensure you work with the latest state
        setUser((prevUser) => {
          if (newUserLevel > prevUser.level) {
            setShowLevelUp(true); // Trigger Level Up Screen
          }
          return updatedUser.user[0]; // Update the user in context
        });

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
      fetchUpdatedData();

      // Play animations when the screen is focused
      if (eventsAnimationRef.current) eventsAnimationRef.current.play();
      if (questsAnimationRef.current) questsAnimationRef.current.play();
      if (leaderboardsAnimationRef.current)
        leaderboardsAnimationRef.current.play();
      if (achievementsAnimationRef.current)
        achievementsAnimationRef.current.play();
    }, []),
  );

  return (
    <ImageBackground
      source={require('../assets/images/homeBack.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Top-right corner icons */}
        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={() => handleNavigate('SettingsScreen')}>
            <Icon name="cog" type="font-awesome" color="white" size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNavigate('NotificationsScreen')}
          >
            <Icon name="bell" type="font-awesome" color="white" size={22} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <UserProfile />
          <Inventory />
          {showLevelUp && <LevelUpScreen />}

          {/* Icons Section */}
          <View style={styles.iconRow}>
            {/* Left Column */}
            <View style={styles.iconColumn}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => handleNavigate('EventsScreen')}
              >
                <LottieView
                  ref={eventsAnimationRef}
                  source={require('../assets/animations/Animation1.json')}
                  autoPlay
                  loop
                  style={styles.customAnimation}
                />
                <Text style={styles.iconText}>Events</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => handleNavigate('QuestsScreen')}
              >
                <LottieView
                  ref={questsAnimationRef}
                  source={require('../assets/animations/Animation2.json')}
                  autoPlay={false}
                  loop={false}
                  style={styles.customAnimation}
                />
                <Text style={styles.iconText}>Quests</Text>
              </TouchableOpacity>

              {/* Placeholder Icon */}
              <TouchableOpacity style={styles.iconContainer}>
                <Icon
                  name="star"
                  type="font-awesome"
                  color="#FFD43B"
                  size={35}
                />
                <Text style={styles.iconText}>Placeholder</Text>
              </TouchableOpacity>
            </View>

            {/* Right Column */}
            <View style={styles.iconColumn}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => handleNavigate('RankedScreen')}
              >
                <Image
                  source={require('../assets/icons/Expert.webp')}
                  style={styles.customIcon}
                />
                <Text style={styles.iconText}>Ranked</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => handleNavigate('LeaderboardScreen')}
              >
                <LottieView
                  ref={leaderboardsAnimationRef}
                  source={require('../assets/animations/Animation3.json')}
                  autoPlay={false}
                  loop={false}
                  style={styles.customAnimation}
                />
                <Text style={styles.iconText}>Leaderboards</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => handleNavigate('AchievementsScreen')}
              >
                <LottieView
                  ref={achievementsAnimationRef}
                  source={require('../assets/animations/Animation4.json')}
                  autoPlay={false}
                  loop={false}
                  style={styles.customAnimation}
                />
                <Text style={styles.iconText}>Achievements</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Play Button */}
          <Button
            onPress={() => handleNavigate('GameModeScreen')}
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
  topRightIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 60,
    marginRight: 0,
    position: 'absolute',
    zIndex: 1,
    gap: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  iconColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '25%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  customAnimation: {
    width: 55,
    height: 55,
  },
  customIcon: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  iconText: {
    marginTop: 8,
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  playButton: {
    height: 70,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'green',
    marginBottom: 40,
  },
});

HomePage.propTypes = {
  navigation: PropTypes.object,
};

export default HomePage;
