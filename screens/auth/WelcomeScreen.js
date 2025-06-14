import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/shoe-logo.png')} // Make sure you have a shoe-related logo here
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>ShoeMate</Text>
      <Text style={styles.subtitle}>Step Into Style • Comfort • Confidence</Text>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa', // light teal background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#006064', // dark teal for shoe branding
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 22,
  },
});
