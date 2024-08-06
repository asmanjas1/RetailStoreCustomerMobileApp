import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import axios from 'axios';
import { getErrorMsgFromAxiosErrorObject } from '../utils/AppUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../navigation/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
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
        const user = { phoneNumber, password };
        axios.post("https://retailstorecloudbase.el.r.appspot.com/v1/person/signin", user)
        .then(response => {
          AsyncStorage.setItem('user', JSON.stringify(response.data));
          login();
        }).catch(error => {
            alert(getErrorMsgFromAxiosErrorObject(error));
        });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Title style={styles.title}>Login</Title>
          <TextInput
            label="Mobile"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
          <View style={styles.passwordContainer}>
          <TextInput
            label="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            error={!!errors.password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons  name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="grey" />
          </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
          <Button onPress={() => navigation.navigate('Signup')} style={styles.link}>
            Don't have an account? Signup
          </Button>
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  passwordInput: {
    marginBottom: 10,
    flex: 0.9,
  },
  button: {
    marginTop: 20,
  },
  link: {
    marginTop: 10,
    alignSelf: 'center',
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
  },
});

export default LoginScreen;