import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setName(user.name);
        setPhoneNumber(user.phoneNumber);
        setOriginalName(user.name);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (name !== originalName) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [name, originalName]);

  const handleSubmit = () => {
    Alert.alert('Submitted', `Name: ${name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Mobile Number *</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={phoneNumber}
        editable={false}
        placeholder="Enter your phone number"
      />

      <TouchableOpacity
        style={[styles.submitButton, !isSubmitEnabled && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert('Delete Account', 'Account deletion not implemented.')}>
        <Text style={styles.deleteAccountText}>Delete Account</Text>
      </TouchableOpacity>

      <Text style={styles.deleteInfo}>
        Deleting your account will remove all your orders, wallet amount and any active referral
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#4E1A66',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#EDE2FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  disabledInput: {
    color: '#9A9A9A',
  },
  infoText: {
    color: '#9A9A9A',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#9872d5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#4E1A66',
    fontWeight: 'bold',
  },
  deleteAccountText: {
    color: '#FF2D55',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  deleteInfo: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
