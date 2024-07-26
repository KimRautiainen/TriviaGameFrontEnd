import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from '@rneui/themed';
import {MainContext} from '../contexts/MainContext';
import Inventory from '../components/homeScreenComponents/inventory';
import {SafeAreaView} from 'react-native-safe-area-context';

const ShopComponent = () => {
  const {user} = useContext(MainContext);
  const [goldCoins, setGoldCoins] = useState(user.goldCoins || 0);

  const shopItems = [
    {
      id: 1,
      name: 'Tournament Ticket',
      description: 'Gain access to exclusive tournaments.',
      icon: 'ticket',
      iconColor: '#FFD700', // Golden color for ticket
      price: 50,
    },
    {
      id: 2,
      name: 'Life',
      description: 'Extra life for trivia games.',
      icon: 'heart',
      iconColor: '#FF0000', // Red color for heart
      price: 20,
    },
    // Add more items as needed
  ];

  const handlePurchase = async (item) => {
    if (goldCoins >= item.price) {
      setGoldCoins(goldCoins - item.price);
      // Update the user's gold coins in AsyncStorage and backend if necessary
      await AsyncStorage.setItem(
        'goldCoins',
        JSON.stringify(goldCoins - item.price),
      );
      console.log(`Purchased ${item.name}`);
    } else {
      console.log('Not enough gold coins');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Shop</Text>
      <View style={styles.goldContainer}>
        <Icon name="coins" size={24} color="#FFD700" type="font-awesome-5" />
        <Text style={styles.goldText}>{goldCoins} Gold Coins</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {shopItems.map((item) => (
          <View key={item.id} style={styles.shopItem}>
            <Icon
              name={item.icon}
              type="font-awesome"
              size={50}
              color={item.iconColor} // Use the specified color for each icon
              style={styles.itemIcon}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>{item.price} Gold Coins</Text>
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={() => handlePurchase(item)}
              >
                <Text style={styles.purchaseButtonText}>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  goldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  goldText: {
    fontSize: 20,
    marginLeft: 8,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  purchaseButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inventory: {
    // marginTop: 16, // Add some spacing if needed
  },
});

export default ShopComponent;
