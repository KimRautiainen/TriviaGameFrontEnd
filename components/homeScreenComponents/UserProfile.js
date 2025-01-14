import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {Bar} from 'react-native-progress';
import PropTypes from 'prop-types';
import {MainContext} from '../../contexts/MainContext';
import {mediaUrl} from '../../utils/app-config';
import {SoundContext} from '../../contexts/SoundContext';

const UserProfile = (navigation, route) => {
  const {user, loading} = useContext(MainContext);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;
  const {playButtonSound} = useContext(SoundContext);

  const handleNavigate = async (screen) => {
    await playButtonSound(); // play sound before navigating
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleNavigate('ProfileScreen')}>
        <Avatar
          size={100}
          rounded
          source={{uri: userAvatarUri}}
          containerStyle={styles.avatar}
        />
      </TouchableOpacity>
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
            height={25}
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
    color: 'white',
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
    bottom: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  xpText: {
    position: 'absolute',
    alignSelf: 'center',
    top: 5,
    color: 'white',
    fontWeight: 'bold',
  },
});

UserProfile.propTypes = {
  userData: PropTypes.shape({
    username: PropTypes.string,
    userAvatar: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    level: PropTypes.number,
    experiencePoints: PropTypes.number,
    maxXp: PropTypes.number,
    totalCorrectAnswers: PropTypes.number,
  }),
};


UserProfile.defaultProps = {
  userData: {
    username: '',
    userAvatar: '',
    level: 0,
    experiencePoints: 0,
    maxXp: 1,
    totalCorrectAnswers: 0,
  },
};

export default UserProfile;
