import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { AntDesign } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);

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
    Alert.alert('Logged out', 'You have been successfully logged out.', [
      { text: 'OK', onPress: () => logout() },
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

  const themeColors = {
    bg: isDarkMode ? '#121212' : '#f9f9f9',
    text: isDarkMode ? '#fff' : '#222',
    border: isDarkMode ? '#555' : '#ccc',
    placeholder: isDarkMode ? '#aaa' : '#888',
    inputBg: isDarkMode ? '#1f1f1f' : '#fff',
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bg }]}>
      <TouchableOpacity onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: '#888' }}>Pick Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {['name', 'email', 'mobile', 'password'].map((field) => (
        <View key={field} style={[styles.inputRow, { borderColor: themeColors.border }]}>
          <TextInput
            value={fields[field]}
            editable={editableFields[field]}
            secureTextEntry={field === 'password'}
            onChangeText={(text) => handleChange(field, text)}
            style={[
              styles.input,
              {
                color: themeColors.text,
                backgroundColor: themeColors.inputBg,
              },
            ]}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            placeholderTextColor={themeColors.placeholder}
          />
          <TouchableOpacity onPress={() => toggleEdit(field)} style={styles.editIcon}>
            <AntDesign name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={saveFieldChanges}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={[styles.label, { color: themeColors.text }]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 25,
  },
  imagePlaceholder: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
  },
  editIcon: {
    marginLeft: 10,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
    justifyContent: 'space-between',
    width: '60%',
  },
  label: {
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#e63946',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ProfileScreen;
