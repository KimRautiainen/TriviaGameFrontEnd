import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {Bar} from 'react-native-progress';
import {mediaUrl} from '../utils/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';

const rankImages = {
  1: require('../assets/icons/Novice.webp'),
  2: require('../assets/icons/Master.webp'),
  3: require('../assets/icons/Expert.webp'),
};

const achievementIcons = [
  require('../assets/icons/tempAch1.png'),
  require('../assets/icons/tempAch2.png'),
  require('../assets/icons/tempAch3.png'),
  require('../assets/icons/tempAch4.png'),
];

const rankRequirements = {
  1: 1000,
  2: 2000,
  3: Infinity,
};

const ProfileScreen = () => {
  const {user, loading, setUser, setIsLoggedIn} = useContext(MainContext);
  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;
  const [isModalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState(user.username);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const handleSaveProfile = () => {
    // TODO: save username etc
    setModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderAchievements = () => {
    return (
      <View style={styles.achievementsSection}>
        <Text style={styles.achievementsHeader}>Earned Achievements</Text>
        <View style={styles.achievementGrid}>
          {achievementIcons.map((icon, index) => (
            <View key={index} style={styles.achievementItem}>
              <Image source={icon} style={styles.achievementIcon} />
              <Text style={styles.achievementLabel}>Achievement</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRankTimeline = () => {
    return (
      <View style={styles.timelineContainer}>
        {Object.entries(rankImages).map(([rankLevel, image]) => (
          <View key={rankLevel} style={styles.rankContainer}>
            <ImageBackground
              source={image}
              style={[
                styles.rankIcon,
                parseInt(rankLevel) === user.rankLevel &&
                  styles.currentRankIcon,
              ]}
              imageStyle={styles.roundedImage}
            >
              {parseInt(rankLevel) > user.rankLevel && (
                <View style={styles.inactiveOverlay} />
              )}
            </ImageBackground>
            <Text
              style={[
                styles.rankLabel,
                parseInt(rankLevel) === user.rankLevel &&
                  styles.currentRankLabel,
                parseInt(rankLevel) > user.rankLevel &&
                  styles.inactiveRankLabel,
              ]}
            >
              {rankLevel === '1'
                ? 'Novice'
                : rankLevel === '2'
                  ? 'Master'
                  : 'Expert'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRankProgress = () => {
    const currentPoints = user.rankPoints || 0;
    const nextRankLevel = user.rankLevel + 1;
    const nextRankRequirement = rankRequirements[nextRankLevel] || Infinity;

    if (user.rankLevel === 3) return null;

    return (
      <View style={styles.rankProgressContainer}>
        <Text style={styles.rankProgressHeader}>Rank Progress</Text>
        <View style={styles.rankProgressBarContainer}>
          <Bar
            progress={Math.min(currentPoints / nextRankRequirement, 1)}
            width={300}
            height={20}
            color="#4a90e2"
            unfilledColor="#ccc"
            borderWidth={0}
            borderRadius={10}
          />
          <Image
            source={rankImages[nextRankLevel]}
            style={styles.nextRankIcon}
          />
        </View>
        <Text style={styles.rankProgressText}>
          {currentPoints} / {nextRankRequirement} Rank Points
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/images/blueSky.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Edit Profile Icon */}
        <TouchableOpacity
          style={styles.editProfileContainer}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesomeIcon icon={faPenToSquare} size={18} color="#000" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Avatar and User Info */}
        <View style={styles.profileHeader}>
          <Image source={{uri: userAvatarUri}} style={styles.avatar} />
          <Text style={styles.userText}>{user.username}</Text>
          <View style={styles.xpBarContainer}>
            <Text style={styles.levelText}>Lvl {user.level}</Text>
          </View>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Edit Profile</Text>

              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />

              <View style={styles.modalButtons}>
                <Pressable
                  onPress={handleSaveProfile}
                  style={[styles.actionButton, styles.saveButton]}
                >
                  <Text style={styles.actionButtonText}>Save</Text>
                </Pressable>

                <Pressable
                  onPress={handleLogout}
                  style={[styles.actionButton, styles.logoutButton]}
                >
                  <Text style={styles.actionButtonText}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Rank Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineHeader}>Ranks</Text>
          {renderRankTimeline()}
        </View>

        {/* Rank Progress */}
        {renderRankProgress()}

        {/* Achievements */}
        {renderAchievements()}

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsHeader}>User Stats</Text>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Correct Answers</Text>
            <Text style={styles.statValue}>{user.totalCorrectAnswers}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Incorrect Answers</Text>
            <Text style={styles.statValue}>{user.totalFalseAnswers}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Games Played</Text>
            <Text style={styles.statValue}>{123}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Achievements Earned</Text>
            <Text style={styles.statValue}>{45}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ranking Points</Text>
            <Text style={styles.statValue}>{user.rankPoints || 0}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Wins</Text>
            <Text style={styles.statValue}>{25}</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    borderColor: '#1E222B',
    borderWidth: 2,
    backgroundColor: '#eee',
  },
  userText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  xpBarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },

  timelineSection: {
    width: '100%',
    marginBottom: 30,
  },
  timelineHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  rankContainer: {
    alignItems: 'center',
    flex: 1,
  },
  rankIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  currentRankIcon: {
    width: 85,
    height: 85,
    borderRadius: 60,
  },
  roundedImage: {
    borderRadius: 30,
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 30,
  },
  rankLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  currentRankLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  inactiveRankLabel: {
    color: 'gray',
  },

  rankProgressContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  rankProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  nextRankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -20,
  },
  rankProgressHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  rankProgressText: {
    fontSize: 14,
    color: '#333',
  },

  achievementsSection: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  achievementsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  achievementItem: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIcon: {
    width: '70%',
    height: '70%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
  achievementLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },

  statsSection: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  statsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#777',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  editProfileContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#000',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginLeft: 10,
  },
});

export default ProfileScreen;
