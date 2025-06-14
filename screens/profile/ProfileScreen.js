import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const [imageUri, setImageUri] = useState(null);
  const [fields, setFields] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
    mobile: false,
    password: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profile_image');
        if (savedImage) setImageUri(savedImage);

        const userData = await AsyncStorage.getItem('localUser');
        if (userData) {
          const parsed = JSON.parse(userData);
          const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim();
          setFields({
            name: fullName,
            email: parsed.email || '',
            mobile: parsed.mobile || '',
            password: parsed.password || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    loadData();

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <Feather name="more-vertical" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const saveFieldChanges = async () => {
    const [firstName, ...rest] = fields.name.trim().split(' ');
    const lastName = rest.join(' ');
    const updatedUser = {
      firstName: firstName || '',
      lastName: lastName || '',
      email: fields.email,
      mobile: fields.mobile,
      password: fields.password,
    };
    await AsyncStorage.setItem('localUser', JSON.stringify(updatedUser));
    Alert.alert('Updated', 'Profile information updated.');
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await AsyncStorage.setItem('profile_image', uri);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={styles.container}>
      <LinearGradient
        colors={["#8e0000", "#c62828", "#e53935", "#ef5350", "#ff8a80"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={imageUri ? { uri: imageUri } : require('../../assets/user.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.imageEditIcon} onPress={pickImage}>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText}>{fields.name}</Text>
      </LinearGradient>

      {['name', 'email', 'mobile', 'password'].map((field) => (
        <View key={field} style={styles.inputBlock}>
          <Text style={styles.label}>{field.toUpperCase()}</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={fields[field]}
              editable={editableFields[field]}
              secureTextEntry={field === 'password'}
              onChangeText={(text) => handleChange(field, text)}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => toggleEdit(field)}>
              <Ionicons name="create-outline" size={22} color="#e53935" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={saveFieldChanges}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  imageEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#e53935',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
  },
  nameText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  inputBlock: {
    width: '85%',
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  saveBtn: {
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 25,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;