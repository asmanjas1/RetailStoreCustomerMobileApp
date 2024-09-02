import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import ProtectedRoute from './ProtectedRoute ';
import { useAuth } from './AuthContext';
import MainScreenNavigator from './MainScreenNavigator';
import AddAddressScreen from '../screens/AddAddressScreen';
import YourComponent from '../screens/Test';
import StoreScreen from '../screens/StoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import OrdersScreen from '../screens/OrdersScreen';
import AddressSelectionScreen from '../screens/AddressSelectionScreen';
import AddressesScreen from '../screens/AddressesScreen';

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
        if (!!userToken) {
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
            headerStyle: {
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
            },
            headerTintColor: '#000',
            headerShadowVisible: true,
            gestureEnabled: true,
          }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="MainScreen"
                children={(props) => <ProtectedRoute component={MainScreenNavigator} {...props} />}
              />
              <Stack.Screen
                name="AddAddress"
                component={AddAddressScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Test"
                component={YourComponent}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Store Details"
                component={StoreScreen}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
              />
              <Stack.Screen
                name="Orders"
                component={OrdersScreen}
              />
              <Stack.Screen
                name="AddressSelectionScreen"
                component={AddressSelectionScreen}
                options={({ navigation }) => ({
                  headerTitle: 'Your Location',
                  headerTitleAlign: 'center',
                })}
              />
              <Stack.Screen
                name="Addresses"
                component={AddressesScreen}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={({ navigation }) => ({
                  headerLeft: () => (
                    <TouchableOpacity
                      style={{ marginLeft: 10 }}
                      onPress={() => navigation.goBack()}
                    >
                      <MaterialIcons name="arrow-back" size={24} />
                    </TouchableOpacity>
                  ),
                  headerBackTitleVisible: false,
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                })}
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
