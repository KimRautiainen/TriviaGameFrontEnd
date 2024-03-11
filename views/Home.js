import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Avatar, Card, Icon} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import {Bar} from 'react-native-progress';
import {SafeAreaView} from 'react-native-safe-area-context';
import profilePic from '../assets/avatar.png';

const HomePage = () => {
  const userData = {
    avatarUrl: profilePic,
    xpPoints: 50,
    maxXp: 200,
    achievementPoints: 300,
    level: 33,
    username: 'User123',
  };

  const gameModes = [
    {title: 'Classic', description: 'Classic trivia mode'},
    {title: 'Timed', description: 'Answer before time runs out!'},
    // Add more game modes as needed
  ];

  const renderCarouselItem = ({item}) => (
    <Card>
      <Card.Title>{item.title}</Card.Title>
      <Text>{item.description}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoRow}>
        <Avatar
          size={110}
          rounded
          source={userData.avatarUrl}
          containerStyle={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Username: {userData.username}</Text>
          <View style={styles.xpBarContainer}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userData.level}</Text>
            </View>
            <Bar
              progress={userData.xpPoints / userData.maxXp}
              width={200}
              height={30}
              color="#4a90e2"
              unfilledColor="#ccc"
              borderWidth={0}
              borderRadius={360}
              style={styles.xpBar}
            />
            <Text
              style={styles.xpText}
            >{`${userData.xpPoints}/${userData.maxXp}`}</Text>
          </View>
          <View style={styles.achievements}>
            <Text style={styles.userText}>
              {userData.achievementPoints} pts
            </Text>
          </View>
        </View>
      </View>
      <Carousel
        data={gameModes}
        renderItem={renderCarouselItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={300}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 120,
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
    marginBottom: 15,
    size: 20,
    fontSize: 16,
    fontWeight: 'bold',
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

export default HomePage;
