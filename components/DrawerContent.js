import React, {useContext} from 'react';
import {View, Text, Image} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {MainContext} from '../contexts/MainContext'; // adjust this import based on your context location

const CustomDrawerContent = (props) => {
  const {user} = useContext(MainContext);
  console.log('user', user);

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{padding: 20, backgroundColor: '#f4f4f4', alignItems: 'center'}}
      >
        {/* Display user info here */}
        <Image
          source={{uri: user.userAvatar}}
          style={{width: 80, height: 80, borderRadius: 40}}
        />
        <Text style={{fontSize: 18, marginTop: 5}}>Username</Text>
        <Text style={{fontSize: 16, color: 'grey'}}>Level: 1</Text>
        <Text style={{fontSize: 16, color: 'grey'}}>Xp: 0</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export {CustomDrawerContent};
