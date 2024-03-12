// components/UserProfile.js
import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Avatar} from 'react-native-elements';
import {Bar} from 'react-native-progress';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/app-config';

const UserProfile = () => {
  // Assuming we always want the first user in the array
  // You might want to add checks for userData.user.length > 0 or similar, depending on your data guarantees
  const {user, loading} = useContext(MainContext);
  console.log('Extracted user data:', user);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Or any other loading indicator
  }
  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;

  return (
    <View style={styles.userInfoRow}>
      <Avatar
        size={110}
        // Ensure the source prop is correctly structured for the Avatar component
        // If userAvatar is a URI string, you need to construct an object with a uri property
        source={{uri: userAvatarUri}}
        containerStyle={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userText}>{user.username}</Text>
        <View style={styles.xpBarContainer}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{user.level}</Text>
          </View>
          <Bar
            progress={
              isNaN(user.experiencePoints / user.maxXp)
                ? 0
                : user.experiencePoints / user.maxXp
            }
            width={200}
            height={30}
            color="#4a90e2"
            unfilledColor="#ccc"
            borderWidth={0}
            borderRadius={360}
            style={styles.xpBar}
          />
          <Text style={styles.xpText}>{`${
            Number.isFinite(user.experiencePoints) ? user.experiencePoints : 0
          }/${Number.isFinite(user.maxXp) ? user.maxXp : 0} XP`}</Text>
        </View>
        <View style={styles.achievements}>
          <Text style={styles.pointsText}>{user.totalCorrectAnswers} pts</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 120,
    backgroundColor: 'white', // A rich, solid color
    padding: 16, // Inner spacing
    borderRadius: 20, // Rounded corners for a softer look
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur
    elevation: 5, // For Android shadow
    margin: 10, // Outer spacing
   // alignItems: 'center', // Center-align the contents
  },
  avatar: {
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userText: {
    marginBottom: 5,
    fontSize: 22, // Adjust size as needed
    fontWeight: 'bold', // Ensures the text is bold
    color: '#FFFFFF', // White color for the text
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Black shadow to make the text pop
    textShadowOffset: {width: 0, height: 1}, // Shadow positioned slightly below the text
    textShadowRadius: 3, // Soften the shadow a bit for a smoother look
    letterSpacing: 2.5, // Add some spacing between characters
  },
  pointsText: {
    marginBottom: 15,
    fontSize: 16,
    color: 'black',
  },
  achievements: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  xpBarContainer: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.9,
  },
  levelBadge: {
    position: 'absolute',
    backgroundColor: '#4a90e2',
    borderRadius: 360,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderColor: 'black',
    borderWidth: 0.2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android elevation
  },
  xpBarOutline: {
    marginLeft: 20,
    borderColor: 'black',
    borderWidth: 2, // Added border
    borderRadius: 15, // Adjust for circular edges
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Android elevation
    // Adjust width and height to fit the Bar component plus the desired padding
    width: 204, // Slightly larger than the Bar width to create a border effect
    height: 34, // Slightly taller than the Bar height
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -0.5, height: 0.5},
    textShadowRadius: 1,
  },
  xpBar: {
    marginLeft: 20,
    height: 30,
    width: 180,
  },
  xpText: {
    position: 'absolute',
    left: 25,
    width: 200,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -0.5, height: 0.5},
    textShadowRadius: 1,
  },
});
// Define PropTypes
UserProfile.propTypes = {
  userData: PropTypes.shape({
    username: PropTypes.string,
    userAvatar: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // If you're using require/import for images
    ]),
    level: PropTypes.number,
    experiencePoints: PropTypes.number,
    maxXp: PropTypes.number,
    totalCorrectAnswers: PropTypes.number,
  }),
};

// Set default props in case they aren't provided
UserProfile.defaultProps = {
  userData: {
    username: '',
    userAvatar: '',
    level: 0,
    experiencePoints: 0,
    maxXp: 1, // Avoid division by zero
    totalCorrectAnswers: 0,
  },
};

export default UserProfile;
