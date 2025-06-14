import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import ProductDetail from '../screens/home/ProductDetail';
import CartScreen from '../screens/cart/CartScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const LogoHeader = () => (
  <View style={{ marginLeft: 15 }}>
    <Image
      source={require('../assets/shoe-logo.png')}
      style={{ width: 55, height: 55, resizeMode: 'contain' }}
    />
  </View>
);

// Tab Navigator Component
const TabNavigator = () => (
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
      headerLeft: () => <LogoHeader />,
      headerTitleAlign: 'center',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainTabs = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{
          headerTitle: 'Product Details',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainTabs;
