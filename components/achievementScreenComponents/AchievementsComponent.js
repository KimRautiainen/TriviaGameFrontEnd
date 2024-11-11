import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAchievements} from '../../hooks/AchievementHooks';
import {MainContext} from '../../contexts/MainContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AchievementsComponent = () => {
  const [achievements, setAchievements] = useState([]);
  const [completedAchievements, setCompletedAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const {getAchievements, getAchievementsByUser} = useAchievements();
  const {user} = useContext(MainContext);
  const userId = user.userId;

  useEffect(() => {
    fetchTokenAndAchievements();
  }, []);

  const fetchTokenAndAchievements = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token not found');
      }

      const achievements = await getAchievements(token);
      setAchievements(achievements);

      const completedAchievements = await getAchievementsByUser(userId, token);
      setCompletedAchievements(completedAchievements);
    } catch (e) {
      console.log('Error fetching achievements:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const isAchievementCompleted = (achievementId) => {
    return completedAchievements.some(
      (achievement) => achievement.achievementId === achievementId,
    );
  };

  const getAchievementProgress = (achievement) => {
    const completedAchievement = completedAchievements.find(
      (completed) => completed.achievementId === achievement.achievementId,
    );
    return completedAchievement ? completedAchievement.progress : 0;
  };

  const getAchievementIcon = (index, isCompleted) => {
    const iconNames = ['trophy', 'star', 'flag', 'certificate', 'thumbs-up'];
    const iconName = iconNames[index % iconNames.length];
    return (
      <Icon
        name={iconName}
        size={50}
        color={isCompleted ? '#FFD700' : 'gray'} // Gold for completed, gray for not completed
        style={styles.achievementIcon}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <View style={styles.achievementsContainer}>
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => {
              const isCompleted = isAchievementCompleted(
                achievement.achievementId,
              );
              const progress = getAchievementProgress(achievement);
              return (
                <View key={index} style={styles.achievementItem}>
                  {getAchievementIcon(index, isCompleted)}
                  <View style={styles.achievementTextContainer}>
                    <Text style={styles.achievementName}>
                      {achievement.name}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    {isCompleted && (
                      <Text style={styles.achievementProgress}>
                        Progress: {progress}/{achievement.requirement}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <Text>No achievements found</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  achievementsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievementDescription: {
    fontSize: 16,
  },
  achievementProgress: {
    fontSize: 14,
    color: 'gray',
  },
});

export default AchievementsComponent;
