import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from '@rneui/themed';
import {useInventory} from '../../hooks/InventoryHooks';
import {MainContext} from '../../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inventory = () => {
  const {user, loading} = useContext(MainContext); // Get the user data from MainContext
  const [inventoryData, setInventoryData] = useState({
    goldCoins: 0,
    tournamentTickets: 0,
  }); // State for inventory data

  const {getUserInventory} = useInventory(); // Hook to get user inventory from backend

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // Retrieve token from AsyncStorage
        const inventory = await getUserInventory(token); // Fetch inventory data from backend
        console.log('Fetched inventory:', inventory);

        if (inventory) {
          setInventoryData({
            goldCoins: inventory.goldCoins || 0,
            tournamentTickets: inventory.tournamentTickets || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

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

        {/* Gold Coins (Fetched from backend) */}
        <View style={styles.item}>
          <TouchableOpacity onPress={() => iconPressed('monetization-on')}>
            <Icon
              name="monetization-on"
              type="material"
              size={34}
              color="#FFD700"
            />
          </TouchableOpacity>
          <Text
            style={styles.itemText}
          >{`${inventoryData.goldCoins} Coins`}</Text>
        </View>

        {/* Tournament Tickets (Fetched from backend) */}
        <View style={styles.item}>
          <TouchableOpacity onPress={() => iconPressed('ticket')}>
            <Icon name="ticket" type="font-awesome" size={34} color="#4CAF50" />
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%', // Adjust based on your preference
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Light grey background for the item boxes
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 4, // Spacing between items
  },
  itemText: {
    marginLeft: 5, // Spacing between icon and text
  },
});

export default Inventory;
