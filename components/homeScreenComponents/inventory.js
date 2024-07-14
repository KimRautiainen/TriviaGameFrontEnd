import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from '@rneui/themed';

const items = [
  {
    name: 'Lives',
    quantity: 10,
    iconName: 'favorite',
    iconType: 'material',
    iconColor: '#FF0000',
  }, // Red color for Lives
  {
    name: 'Coins',
    quantity: 20,
    iconName: 'monetization-on',
    iconType: 'material',
    iconColor: '#FFD700',
  }, // Gold color for Coins
];

const iconPressed = (iconName) => {
  console.log('Icon pressed:', iconName);
};

const Inventory = () => {
  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <TouchableOpacity onPress={() => iconPressed(item.iconName)}>
              <Icon
                name={item.iconName}
                type={item.iconType}
                size={34}
                color={item.iconColor}
              />
            </TouchableOpacity>
            <Text
              style={styles.itemText}
            >{`${item.quantity} ${item.name}`}</Text>
          </View>
        ))}
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
