import React from 'react';
import { Platform, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrdersScreen = ({navigation }) => {
  return (
    <>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View
            style={{
              backgroundColor: "#00CED1",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}>
            
          </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  userIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});

export default OrdersScreen;
