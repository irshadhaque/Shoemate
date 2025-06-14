import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import ProductDetail from '../screens/home/ProductDetail';
import CartScreen from '../screens/cart/CartScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconPath;

          if (route.name === 'Home') {
            iconPath = require('../assets/home.png');
          } else if (route.name === 'Cart') {
            iconPath = require('../assets/grocery-store.png');
          } else if (route.name === 'Profile') {
            iconPath = require('../assets/user.png');
          } else if(route.name === 'ProductDetail'){
            iconPath=require('../assets/product.png')
          }

          return (
            <Image
              source={iconPath}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#009688' : 'gray',
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#009688',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="ProductDetail" component={ProductDetail}/>

    </Tab.Navigator>
  );
};

export default MainTabs;
