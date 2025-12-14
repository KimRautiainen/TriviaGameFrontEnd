import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
} from 'react-native';
import questMock from '../data/questMocks';

const QuestScreen = () => {
  const [selectedTab, setSelectedTab] = useState('daily'); // State for active tab

  // Filter quests based on selected type
  const filteredQuests = questMock.quests.filter((q) => q.type === selectedTab);

  // Get user's quest progress
  const getUserProgress = (questId) => {
    const userQuest = questMock.user_quests.find((q) => q.quest_id === questId);
    return userQuest ? userQuest.progress : null;
  };

  // Render each quest card
  const renderQuestCard = ({item}) => {
    const progress = getUserProgress(item.quest_id);
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardReward}>🏆 {item.reward}</Text>
        {progress && (
          <Text style={styles.cardProgress}>
            Progress:{' '}
            {Object.keys(progress)
              .map((key) => `${key}: ${progress[key]}`)
              .join(', ')}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/images/blueSky.jpeg')}
      style={styles.background}
    >
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['daily', 'weekly', 'monthly'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quest List */}
      <View style={styles.contentContainer}>
        {filteredQuests.length > 0 ? (
          <FlatList
            data={filteredQuests}
            keyExtractor={(item) => item.quest_id.toString()}
            renderItem={renderQuestCard}
          />
        ) : (
          <Text style={styles.noQuestsText}>No quests available</Text>
        )}
      </View>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 50, 0.8)',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'white',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  activeTabText: {
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardDescription: {
    fontSize: 14,
    color: 'white',
    marginVertical: 5,
  },
  cardReward: {
    fontSize: 14,
    color: 'gold',
    fontWeight: 'bold',
  },
  cardProgress: {
    fontSize: 12,
    color: 'lightgreen',
    marginTop: 5,
  },
  noQuestsText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    marginTop: 20,
  },
});

export default QuestScreen;
