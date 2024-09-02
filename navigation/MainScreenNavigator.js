import React, { useEffect, useState } from 'react';
import HomeScreenCustomer from '../screens/HomeScreenCustomer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import HomeScreenStore from '../screens/HomeScreenStore';

const MainScreenNavigator = ({navigation}) => {
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
      <HomeScreenCustomer navigation={navigation} />
    );
  }
  if (userType === 'store') {
    return (
      <HomeScreenStore navigation={navigation} />
    );
  }

};

export default MainScreenNavigator;
