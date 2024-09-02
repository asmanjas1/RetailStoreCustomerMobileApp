import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
  ActivityIndicator, TextInput,
  Text
} from 'react-native';
import axios from 'axios';
import { getAPIUrl, getErrorMsgFromAxiosErrorObject } from '../utils/AppUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../navigation/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '../utils/CommonStyles';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!phoneNumber) newErrors.phoneNumber = 'Mobile number is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      const user = { phoneNumber, password };
      axios.post(getAPIUrl() + "/person/signin", user)
        .then(response => {
          AsyncStorage.setItem('user', JSON.stringify(response.data));
          setIsLoading(false);
          login();
        }).catch(error => {
          setIsLoading(false);
          alert(getErrorMsgFromAxiosErrorObject(error));
        });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.innerContainer}>
          <TextInput
            placeholder="Mobile"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={commonStyles.input}
            keyboardType="phone-pad"
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
              error={!!errors.password}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="grey" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <TouchableOpacity style={commonStyles.button} onPress={handleLogin} disabled={isLoading}>
            <Text style={commonStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('Signup')}>
            <Text style={commonStyles.buttonText}>Don't have an account? Signup</Text>
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
  passwordInput: {
    padding: 10,
    marginBottom: 10,
    flex: 0.9,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  eyeIcon: {
    padding: 5,
    flex: 0.1,
    alignItems: 'flex-end',
  }
});

export default LoginScreen;