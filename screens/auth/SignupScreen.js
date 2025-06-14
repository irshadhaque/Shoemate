import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!firstName || !lastName || !mobile || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const newUser = {
      firstName,
      lastName,
      mobile,
      email: email.trim().toLowerCase(),
      password,
    };
    await AsyncStorage.setItem('localUser', JSON.stringify(newUser));
    Alert.alert('Success', 'Signup successful. Please login.');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Image
              source={require('../../assets/shoe-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.heading}>Welcome To SHOEMATE</Text>

            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
            <TextInput
              placeholder="Mobile"
              value={mobile}
              onChangeText={setMobile}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
              <Text style={styles.loginButtonText}>SIGN UP</Text>
            </TouchableOpacity>

            <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
              Already have an account? <Text style={styles.linkBold}>Login</Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#d32f2f',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#d32f2f',
  },
});

export default SignupScreen;
