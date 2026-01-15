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
import PropTypes from 'prop-types';
import {useFocusEffect} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import {useInventory} from '../hooks/InventoryHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LevelUpScreen from './LevelUpScreen';
import {SoundContext} from '../contexts/SoundContext';
import LottieView from 'lottie-react-native';
import {FontAwesome} from '@expo/vector-icons';

const HomePage = ({navigation}) => {
  const {setUser, setInventoryData, showLevelUp, setShowLevelUp} =
    useContext(MainContext);

  const {getUserByToken} = useUser();
  const {getUserInventory} = useInventory();
  const {playButtonSound} = useContext(SoundContext);

  const eventsAnimationRef = useRef(null);
  const questsAnimationRef = useRef(null);
  const leaderboardsAnimationRef = useRef(null);
  const achievementsAnimationRef = useRef(null);

  const handleNavigate = async (screen) => {
    try {
      await playButtonSound?.();
    } catch (e) {
      // don't block navigation if sound fails
    }
    navigation.navigate(screen);
  };

  const fetchUpdatedData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const updatedUser = await getUserByToken(token);
      const nextUser = updatedUser?.user?.[0];

      if (nextUser) {
        setUser((prevUser) => {
          const prevLevel = prevUser?.level ?? 0;
          const newLevel = nextUser.level ?? 0;

          if (newLevel > prevLevel) {
            setShowLevelUp(true);
          }
          return nextUser;
        });
      }

      const updatedInventory = await getUserInventory(token);
      setInventoryData({
        goldCoins: updatedInventory?.goldCoins ?? 0,
        tournamentTickets: updatedInventory?.tournamentTickets ?? 0,
      });
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUpdatedData();

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
        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={() => handleNavigate('SettingsScreen')}>
            <FontAwesome name="cog" color="white" size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleNavigate('NotificationsScreen')}
          >
            <FontAwesome name="bell" color="white" size={22} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <UserProfile />
          <Inventory />
          {showLevelUp && <LevelUpScreen />}

          <View style={styles.iconRow}>
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

              <TouchableOpacity style={styles.iconContainer} onPress={() => {}}>
                <FontAwesome name="star" color="#FFD43B" size={35} />
                <Text style={styles.iconText}>Placeholder</Text>
              </TouchableOpacity>
            </View>

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
                onPress={() => handleNavigate('AchievementScreen')}
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

          <TouchableOpacity
            onPress={() => handleNavigate('GameModeScreen')}
            activeOpacity={0.85}
            style={styles.playButton}
          >
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  background: {flex: 1, height: '100%'},
  topRightIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 60,
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
  customAnimation: {width: 55, height: 55},
  customIcon: {width: 55, height: 55, borderRadius: 30},
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
  playButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
});

HomePage.propTypes = {
  navigation: PropTypes.object,
};

export default HomePage;
