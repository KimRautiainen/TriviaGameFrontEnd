import React, {useContext} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {Bar} from 'react-native-progress';
import PropTypes from 'prop-types';
import {MainContext} from '../../contexts/MainContext';
import {mediaUrl} from '../../utils/app-config';

const UserProfile = () => {
  const {user, loading} = useContext(MainContext);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;

  return (
    <View style={styles.container}>
      <Avatar
        size={110}
        rounded
        source={{uri: userAvatarUri}}
        containerStyle={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userText}>{user.username}</Text>
        <View style={styles.xpBarContainer}>
          <Text style={styles.levelText}>Lvl {user.level}</Text>
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
          />
          <Text style={styles.xpText}>
            {`${
              Number.isFinite(user.experiencePoints) ? user.experiencePoints : 0
            }/${Number.isFinite(user.maxXp) ? user.maxXp : 0} XP`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    //margin: 10,
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
    marginLeft: 10,
    marginBottom: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    justifyContent: 'center',
  },
  achievementsIcon: {
    position: 'absolute',
  },
  xpBarContainer: {
    position: 'relative',
  },
  levelText: {
    position: 'absolute',
    marginLeft: 10,
    bottom: 30, // Adjust this value based on your layout to position the level text correctly above the progress bar
    color: 'black',
    fontWeight: 'bold',
  },
  xpText: {
    position: 'absolute',
    alignSelf: 'center',
    top: 5, // Adjust to align inside the progress bar
    color: 'white',
    fontWeight: 'bold',
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
