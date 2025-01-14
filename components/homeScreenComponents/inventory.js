import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from '@rneui/themed';
import {MainContext} from '../../contexts/MainContext'; // Import MainContext
import LottieView from 'lottie-react-native';

const Inventory = () => {
  const {inventoryData} = useContext(MainContext); // Get the inventory data from MainContext

  const iconPressed = (iconName) => {
    console.log('Icon pressed:', iconName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        {/* Lives (Hardcoded for now) */}
        <View style={styles.item}>
          <TouchableOpacity onPress={() => iconPressed('favorite')}>
            <Icon name="favorite" type="material" size={34} color="#FF0000" />
          </TouchableOpacity>
          <Text style={styles.itemText}>{`10 Lives`}</Text>
        </View>

        {/* Gold Coins (Animation) */}
        <View style={styles.item}>
          <TouchableOpacity onPress={() => iconPressed('goldCoins')}>
            <LottieView
              source={require('../../assets/animations/goldCoin.json')} // Gold coin animation
              autoPlay
              loop
              style={styles.animation}
            />
          </TouchableOpacity>
          <Text
            style={styles.itemText}
          >{`${inventoryData.goldCoins} Coins`}</Text>
        </View>

        {/* Tournament Tickets (Animation) */}
        <View style={styles.item}>
          <TouchableOpacity onPress={() => iconPressed('tournamentTickets')}>
            <LottieView
              source={require('../../assets/animations/tournamentTicket.json')} // Tournament ticket animation
              autoPlay
              loop
              style={styles.animation}
            />
          </TouchableOpacity>
          <Text
            style={styles.itemText}
          >{`${inventoryData.tournamentTickets} Tickets`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemsContainer: {
    padding: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.12)', // Semi-transparent background for the gold container
    borderRadius: 25,
    marginTop: 65,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 6,
    marginHorizontal: 4, // Spacing between items
  },
  itemText: {
    marginLeft: 5, // Spacing between icon and text
    color: 'white',
  },
  animation: {
    width: 40, // Adjust size as needed
    height: 40,
  },
});

export default Inventory;
