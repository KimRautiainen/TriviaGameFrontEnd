import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome, FontAwesome5} from '@expo/vector-icons';
import {MainContext} from '../contexts/MainContext';
import {useInventory} from '../hooks/InventoryHooks';
import Toast from 'react-native-toast-message';

// -- Shop screen where players can exchange their goldcoins -- //
const ShopComponent = () => {
  const {inventoryData, setInventoryData} = useContext(MainContext);
  const {deductItemsFromInventory, addItemsToInventory} = useInventory();

  const shopItems = [
    {
      id: 1,
      name: 'Tournament Ticket',
      description: 'Gain access to exclusive tournaments.',
      icon: 'ticket',
      iconColor: '#FFD700',
      price: 50,
    },
    {
      id: 2,
      name: 'Life',
      description: 'Extra life for trivia games.',
      icon: 'heart',
      iconColor: '#FF0000',
      price: 20,
    },
  ];

  const handlePurchase = async (item) => {
    const token = await AsyncStorage.getItem('userToken');

    if (inventoryData.goldCoins >= item.price) {
      const itemsToDeduct = {goldCoins: item.price};

      try {
        await deductItemsFromInventory(itemsToDeduct, token);

        setInventoryData((prevState) => ({
          ...prevState,
          goldCoins: prevState.goldCoins - item.price,
        }));

        const itemsToAdd = {
          tournamentTickets: item.name === 'Tournament Ticket' ? 1 : 0,
          otherItems: item.name === 'Life' ? {lives: 1} : {},
        };

        await addItemsToInventory(itemsToAdd, token);

        if (item.name === 'Tournament Ticket') {
          setInventoryData((prevState) => ({
            ...prevState,
            tournamentTickets: prevState.tournamentTickets + 1,
          }));
        }

        Toast.show({
          type: 'success',
          text1: 'Purchase Successful',
          text2: `You have successfully purchased ${item.name}!`,
          visibilityTime: 4000,
          text1Style: {fontSize: 18, fontWeight: 'bold'},
          text2Style: {fontSize: 16},
          style: {padding: 15, borderRadius: 10, minHeight: 80},
        });
      } catch (error) {
        console.error('Error during purchase transaction:', error.message);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Not Enough Coins',
        text2: 'You do not have enough gold coins to make this purchase.',
        visibilityTime: 4000,
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2Style: {fontSize: 16},
        style: {padding: 15, borderRadius: 10, minHeight: 80},
      });
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/pet_toys.jpg')}
      style={styles.headerBackground}
    >
      <View style={styles.safeArea}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to the Shop</Text>
        </View>

        <View style={styles.goldContainer}>
          <FontAwesome5 name="coins" size={24} color="#FFD700" />
          <Text style={styles.goldText}>
            {inventoryData.goldCoins} Gold Coins
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {shopItems.map((item) => (
            <View key={item.id} style={styles.shopItem}>
              <View style={styles.itemIconContainer}>
                <FontAwesome
                  name={item.icon}
                  size={50}
                  color={item.iconColor}
                />
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>{item.price} Gold Coins</Text>

                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => handlePurchase(item)}
                >
                  <Text style={styles.purchaseButtonText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  headerBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 25,
  },
  titleContainer: {
    marginTop: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 35,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 4, height: 4},
    textShadowRadius: 10,
  },
  goldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
  },
  goldText: {
    fontSize: 22,
    marginLeft: 8,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemIconContainer: {
    marginRight: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemDetails: {flex: 1},
  itemName: {fontSize: 22, fontWeight: 'bold', color: '#333'},
  itemDescription: {fontSize: 16, color: '#666', marginVertical: 5},
  itemPrice: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  purchaseButton: {
    backgroundColor: '#FF385C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  purchaseButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default ShopComponent;
