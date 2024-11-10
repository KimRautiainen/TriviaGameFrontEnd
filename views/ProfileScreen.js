import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import {Bar} from 'react-native-progress';
import {mediaUrl} from '../utils/app-config';

const ProfileScreen = () => {
  const {user, loading} = useContext(MainContext);
  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar and User Info */}
      <View style={styles.profileHeader}>
        <Avatar
          size={150}
          rounded
          source={{uri: userAvatarUri}}
          containerStyle={styles.avatar}
        />
        <Text style={styles.userText}>{user.username}</Text>
        <Text style={styles.rankText}>Rank: #{user.rank}</Text>
        <View style={styles.xpBarContainer}>
          <Text style={styles.levelText}>Lvl {user.level}</Text>
          <Bar
            progress={
              isNaN(user.experiencePoints / user.maxXp)
                ? 0
                : user.experiencePoints / user.maxXp
            }
            width={250}
            height={25}
            color="#4a90e2"
            unfilledColor="#ccc"
            borderWidth={0}
            borderRadius={360}
          />
          <Text style={styles.xpText}>
            {`${user.experiencePoints}/${user.maxXp} XP`}
          </Text>
        </View>
      </View>

      {/* Stats Section */}
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
          {/* Example hardcoded data */}
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Achievements Earned</Text>
          <Text style={styles.statValue}>{45}</Text>
          {/* Example hardcoded data */}
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Ranking Points</Text>
          <Text style={styles.statValue}>{user.rankPoints || 1000}</Text>
          {/* Example hardcoded data */}
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Wins</Text>
          <Text style={styles.statValue}>{25}</Text>
          {/* Example hardcoded data */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    marginBottom: 10,
    borderColor: '#1E222B',
    borderWidth: 2,
  },
  userText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  rankText: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 15,
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
  xpText: {
    fontSize: 14,
    color: 'white',
  },
  statsSection: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    marginBottom: 30,
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
});

export default ProfileScreen;
