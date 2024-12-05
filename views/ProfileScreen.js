import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import {Bar} from 'react-native-progress';
import {mediaUrl} from '../utils/app-config';

const rankImages = {
  1: require('../assets/icons/Novice.webp'), // Novice icon
  2: require('../assets/icons/Master.webp'), // Master icon
  3: require('../assets/icons/Expert.webp'), // Expert icon
};

const achievementIcons = [
  // Temp icons
  require('../assets/icons/tempAch1.png'),
  require('../assets/icons/tempAch2.png'),
  require('../assets/icons/tempAch3.png'),
  require('../assets/icons/tempAch4.png'),
];

const rankRequirements = {
  1: 1000, // Points required for Novice
  2: 2000, // Points required for Master
  3: Infinity, // No further progress for Expert
};

const ProfileScreen = () => {
  const {user, loading} = useContext(MainContext);
  const userAvatarUri = `${mediaUrl}${user.userAvatar}`;

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

    // Hide progress section if user is already Expert
    if (user.rankLevel === 3) return null;

    return (
      <View style={styles.rankProgressContainer}>
        <Text style={styles.rankProgressHeader}>Rank Progress</Text>
        <View style={styles.rankProgressBarContainer}>
          <Bar
            progress={currentPoints / nextRankRequirement}
            width={300}
            height={20}
            color="#4a90e2"
            unfilledColor="#ccc"
            borderWidth={0}
            borderRadius={10}
            Text={'heihoi'}
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
        {/* Avatar and User Info */}
        <View style={styles.profileHeader}>
          <Avatar
            size={150}
            rounded
            source={{uri: userAvatarUri}}
            containerStyle={styles.avatar}
          />
          <Text style={styles.userText}>{user.username}</Text>
          <View style={styles.xpBarContainer}>
            <Text style={styles.levelText}>Lvl {user.level}</Text>
          </View>
        </View>

        {/* Rank Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineHeader}>Ranks</Text>
          {renderRankTimeline()}
        </View>

        {/* Rank Progress */}
        {renderRankProgress()}

        {/* Achievements Section */}
        {renderAchievements()}

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
    flex: 1,
    position: 'absolute',
    top: 5,
    zIndex: 5,
    fontSize: 12,
    color: '#000',
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
    resizeMode: 'cover',
    borderRadius: 30,
    overflow: 'hidden',
  },
  currentRankIcon: {
    width: 85, // Larger size for current rank
    height: 85,
    borderRadius: 60,
    resizeMode: 'cover',
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
    color: '#4a90e2',
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
    marginTop: 0,
    position: 'relative',
  },
  nextRankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -20, // Slight overlap with progress bar
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
    justifyContent: 'space-between', // Spacing between items
    paddingHorizontal: 10, // Match the spacing from rank icons
  },
  achievementItem: {
    width: '30%', // Makes 3 items fit per row with spacing
    aspectRatio: 1, // Keeps items square
    marginBottom: 10, // Spacing between rows
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
  },
  achievementIcon: {
    width: '70%',
    height: '70%',
    borderRadius: 50, // Makes images rounded
    resizeMode: 'cover',
  },
  achievementLabel: {
    marginTop: 5, // Space between the icon and text
    fontSize: 12, // Small text for the label
    color: '#555', // Subtle color for the label
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
});

export default ProfileScreen;
