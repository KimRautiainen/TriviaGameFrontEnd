import React, {useContext} from 'react';
import {View, Text, Image} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {MainContext} from '../contexts/MainContext'; // adjust this import based on your context location
import {apiUrl} from '../utils/app-config';

const CustomDrawerContent = (props) => {
  const {user} = useContext(MainContext);
  console.log('user', user);
  const imageUrl = apiUrl + 'uploads/' + user.userAvatar;
  console.log('Image URL:', imageUrl);

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{padding: 20, backgroundColor: '#f4f4f4', alignItems: 'center'}}
      >
        {/* Display user info here */}
        <Image
          source={{uri: imageUrl}}
          style={{width: 80, height: 80, borderRadius: 40}}
        />
        <Text style={{fontSize: 18, marginTop: 5}}>{user.username}</Text>
        <Text style={{fontSize: 16, color: 'grey'}}>Level: {user.level}</Text>
        <Text style={{fontSize: 16, color: 'grey'}}>
          Xp: {user.experiencePoints} / {user.maxXp}
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export {CustomDrawerContent};
