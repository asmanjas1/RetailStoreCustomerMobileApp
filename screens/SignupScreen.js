import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TextInput, Text, 
  TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAPIUrl, getErrorMsgFromAxiosErrorObject } from '../utils/AppUtils';
import { useAuth } from '../navigation/AuthContext';
import { commonStyles } from '../utils/CommonStyles';

const SignupScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!phoneNumber) newErrors.phoneNumber = 'Mobile number is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validateForm()) {
      setIsLoading(true);
      const user = { phoneNumber, password, name };
      axios.post(getAPIUrl() + "/person/signup", user)
      .then(response => {
        axios.post(getAPIUrl() + "/person/signin", user)
        .then(response => {
          AsyncStorage.setItem('user', JSON.stringify(response.data));
          setIsLoading(false);
          login();
        }).catch(error => {
            setIsLoading(false);
            alert(getErrorMsgFromAxiosErrorObject(error));
        });
      }).catch(error => {
        setIsLoading(false);
        alert(getErrorMsgFromAxiosErrorObject(error));
      });
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.innerContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={commonStyles.input}
            error={!!errors.name}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <TextInput
            placeholder="Mobile"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={commonStyles.input}
            keyboardType="phone-pad"
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={commonStyles.input}
            error={!!errors.password}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={commonStyles.input}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
          <TouchableOpacity style={commonStyles.button} onPress={handleSignup} disabled={isLoading}>
            <Text style={commonStyles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});

export default SignupScreen;
