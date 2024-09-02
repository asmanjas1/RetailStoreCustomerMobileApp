import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../navigation/AuthContext';

const SettingsScreen = ({navigation}) => {
  const { logout } = useAuth();
  const [userType, setuserType] = useState();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        let user = await AsyncStorage.getItem('user');
        user = JSON.parse(user);
        setuserType(user.userType);
      } catch (error) {
        console.error('Error checking authentication status', error);
      }
    }
    checkUserType();
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
      <Pressable style={styles.item} onPress={() => navigation.navigate('Orders')}>
        <Ionicons name="bag-outline" size={24} color="#5A2D82" />
        <Text style={styles.itemText}>Orders</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#D7263D" />
      </Pressable>
      <Pressable style={styles.item} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color="#5A2D82" />
        <Text style={styles.itemText}>Profile</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#D7263D" />
      </Pressable>
      {userType === 'store' &&
      <Pressable style={styles.item} onPress={() => navigation.navigate('Store Details')}>
        <Ionicons name="location-outline" size={24} color="#5A2D82" />
        <Text style={styles.itemText}>Store Details</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#D7263D" />
      </Pressable>
      }
      {!userType &&
      <Pressable style={styles.item} onPress={() => navigation.navigate('Addresses')}>
        <Ionicons name="location-outline" size={24} color="#5A2D82" />
        <Text style={styles.itemText}>Addresses</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#D7263D" />
      </Pressable>
      }
      <Pressable style={styles.item} onPress={() => navigation.navigate('Test')}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#5A2D82" />
        <Text style={styles.itemText}>Test</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#D7263D" />
      </Pressable>
      <Pressable style={styles.item} onPress={handleLogout}>
        <AntDesign name="logout" size={24} color="#5A2D82" />
        <Text style={styles.itemText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
  },
});

export default SettingsScreen;
