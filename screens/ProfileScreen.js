import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../navigation/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('user');
      setUser(JSON.parse(user));
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      logout();
    } catch (error) {
      console.error('Error logging out', error);
    }
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Profile</Title>
      <Text style={styles.text}>Name: {user.name}</Text>
      <Text style={styles.text}>Mobile: {user.phoneNumber}</Text>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;
