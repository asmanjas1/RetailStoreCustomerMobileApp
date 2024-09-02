// src/screens/OrdersScreen.js
import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CartScreen = ({navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Your orders content */}
      <Text>helllo CartScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default CartScreen;
