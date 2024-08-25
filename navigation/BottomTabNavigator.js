import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreenCustomer from '../screens/HomeScreenCustomer';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import StoreScreen from '../screens/StoreScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setuserType] = useState();
  
  useEffect(() => {
    const checkUserType = async () => {
      try {
        let user = await AsyncStorage.getItem('user');
        user = JSON.parse(user);
        setuserType(user.userType);
      } catch (error) {
        console.error('Error checking authentication status', error);
      } finally {
        setIsLoading(false);
      }
    }
    checkUserType();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userType) {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Orders') {
              iconName = 'assignment';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreenCustomer} options={{ headerShown: false }} />
        <Tab.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }

  if (userType === 'store') {
    return (
      <Tab.Navigator
        initialRouteName="Orders"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Store') {
              iconName = 'store';
            } else if (route.name === 'Orders') {
              iconName = 'assignment';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Store" component={StoreScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }

};

export default BottomTabNavigator;
