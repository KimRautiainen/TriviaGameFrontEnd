import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useLeaderboard} from '../hooks/LeaderboardHooks';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import LoadingIndicator from '../components/sharedComponents/LoadingIndicator';
import {mediaUrl} from '../utils/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -- Leaderboard screen to show users current points and ranking for that leaderboard -- //
// TODO: Make the leaderboard screen to take gameid aswell to have own leaderboard for all different games including custom events
const LeaderboardScreen = ({navigation, route}) => {
  // State for leaderboard data, user's score, and loading state
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userScore, setUserScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hooks for API interactions
  const {getLeaderboard, getLeaderboardById} = useLeaderboard();
  const {getUserById} = useUser(); // Fetch user details by ID
  const {user} = useContext(MainContext); // Access the logged-in user's data

  // Function to fetch leaderboard data and user's position
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true); // Set loading state true during data fetch
      const token = await AsyncStorage.getItem('userToken'); // Retrieve user token for API authentication

      // Fetch top 5 leaderboard entries
      const leaderboardResponse = await getLeaderboard();
      if (
        Array.isArray(leaderboardResponse) &&
        leaderboardResponse.length > 0
      ) {
        // Fetch additional details (e.g., username and avatar) for each leaderboard entry
        const leaderboardWithDetails = await Promise.all(
          leaderboardResponse.map(async (entry) => {
            const userDetails = await getUserById(entry.userId, token);
            return {
              ...entry,
              username: userDetails.username,
              userAvatar: userDetails.userAvatar,
            };
          }),
        );
        setLeaderboardData(leaderboardWithDetails); // Combine fetched data to state
      } else {
        console.log(
          'Leaderboard response is empty or unsuccessful:',
          leaderboardResponse,
        );
      }

      // Fetch the logged-in user's position in the leaderboard
      const userLeaderboardResponse = await getLeaderboardById(user.userId);
      if (userLeaderboardResponse) {
        const userDetails = await getUserById(user.userId, token);
        setUserScore({
          ...userLeaderboardResponse[0],
          username: userDetails.username,
          userAvatar: userDetails.userAvatar,
        });
        console.log('User Score Data:', userLeaderboardResponse[0]);
      } else {
        console.log(
          'User leaderboard response is empty or unsuccessful:',
          userLeaderboardResponse,
        );
      }

      setLoading(false); // Data fetched, set loading state false
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLoading(false);
    }
  };

  // Fetch leaderboard data when the component mounts
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // Display a loading spinner while data is being fetched
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <ImageBackground
      source={require('../assets/images/leaderboard.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Top 5 leaderboard entries */}
        {leaderboardData.slice(0, 5).map((player, index) => (
          <View
            key={player.leaderboardId || index}
            style={[
              styles.leaderboardRow,
              {top: 160 + index * 70}, // Adjust the vertical spacing for rows
            ]}
          >
            {/* Player's rank */}
            <Text style={styles.position}>{index + 1}</Text>
            {/* Player's avatar */}
            <Image
              source={
                player.userAvatar
                  ? {uri: `${mediaUrl}${player.userAvatar}`}
                  : require('../assets/icons/avatar.png')
              }
              style={styles.avatar}
            />
            {/* Player's username */}
            <Text style={styles.username}>
              {player.username || `Player ${player.userId}`}
            </Text>
            {/* Player's score */}
            <Text style={styles.score}>{player.score}</Text>
          </View>
        ))}

        {/* Logged-in user's leaderboard position (if not in top 5) */}
        {!leaderboardData.some((player) => player.userId === user.userId) ? (
          <View
            style={[
              styles.leaderboardRow, // Use the same style as other rows for consistency
              {top: 160 + 5 * 70}, // Place the user's row immediately below the top 5 rows
            ]}
          >
            {/* User's position */}
            <Text style={styles.position}>{userScore?.position || '-'}</Text>
            {/* User's avatar */}
            <Image
              source={
                userScore?.userAvatar
                  ? {uri: `${mediaUrl}${userScore.userAvatar}`}
                  : require('../assets/icons/avatar.png')
              }
              style={styles.avatar}
            />
            {/* User's username */}
            <Text style={styles.username}>
              {userScore?.username || `Player ${user.userId}`}
            </Text>
            {/* User's score */}
            <Text style={styles.score}>{userScore?.score || 0}</Text>
          </View>
        ) : null}
      </View>
    </ImageBackground>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    position: 'relative', // Ensure rows are positioned relative to this container
    width: '100%',
    height: '100%',
  },
  leaderboardRow: {
    position: 'absolute', // Allow precise placement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20, // Keep some margin on the sides
    width: '80%',
  },
  position: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: '10%',
    textAlign: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    width: '30%',
  },
});

LeaderboardScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LeaderboardScreen;
