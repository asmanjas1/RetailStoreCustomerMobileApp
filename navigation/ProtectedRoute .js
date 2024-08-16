import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { isLoggedIn } from '../utils/AppUtils';


const ProtectedRoute = ({ component: Component, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setIsAuthenticated(loggedIn);
      setLoading(false);
      if (!loggedIn) {
        navigation.navigate('Login');
      }
    };

    checkAuth();
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return isAuthenticated ? <Component navigation={navigation }/> : null;
};

export default ProtectedRoute;
