import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import ProtectedRoute from './ProtectedRoute ';
import { useAuth } from './AuthContext';
import BottomTabNavigator from './BottomTabNavigator';
import AddressScreen from '../screens/AddressScreen';
import YourComponent from '../screens/Test';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, login, logout } = useAuth();
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const userToken = await AsyncStorage.getItem('user');
          if(!!userToken) {
              login();
          } else {
              logout();
          }         
        } catch (error) {
          console.error('Error checking authentication status', error);
        } finally {
          setIsLoading(false);
        }
      }
      checkAuth();
    }, []);

  if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
  }
        
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: '#fff',
            }}
        >
            {isAuthenticated ? (
                <>
                <Stack.Screen
                  name="MainScreen"
                  options={{ headerShown: false }}
                  children={(props) => <ProtectedRoute component={BottomTabNavigator} {...props} />}
                />
                <Stack.Screen
                  name="Address"
                  component={AddressScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Test"
                  component={YourComponent}
                  options={{ headerShown: false }}
                />
                </>
              ) : (
                <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                </>
            )}    
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
