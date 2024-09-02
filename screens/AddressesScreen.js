import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, Pressable } from 'react-native';
import { Text, Button, Title } from 'react-native-paper';
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { getAPIUrl } from '../utils/AppUtils';

const AddressesScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddresses();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchAddresses = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      user = JSON.parse(user);
      const response = await axios.get(getAPIUrl() + `/address/getAllAddressById/${user.phoneNumber}`);
      let savedAddress = response.data;
      setAddresses(savedAddress);
    } catch (error) {
      console.log("error while fetching address ", error);
    }
  };

  return (
    <>
      <ScrollView scrollEnabled={true} >
        {addresses?.map((item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: 30,
                borderBottomWidth: 1,
                borderBottomColor: '#EDEDED',
              }}
              key={index}>
              <Entypo name="location-pin" size={24} color="red" />
              <Text style={{
                flex: 1,
                fontSize: 16,
                color: '#000',
                marginLeft: 5,
              }}>
                {item?.addressLine1} {item?.addressLine2} {item?.locality} {item?.landmark}
                {item?.city} {item?.state} {item?.pincode}
              </Text>
            </View>
          )
        })}
        <Pressable
              onPress={() => {
                navigation.navigate("AddAddress", { comingFrom: 'AddressScreen' });
              }}
              style={{
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#EDEDED',
                margin: 30
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#D7263D",
                  fontWeight: "500",
                }}
              >
                Add New Address
              </Text>
            </Pressable>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#4E1A66',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#EDE2FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  disabledInput: {
    color: '#9A9A9A',
  },
  infoText: {
    color: '#9A9A9A',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#9872d5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#4E1A66',
    fontWeight: 'bold',
  },
  deleteAccountText: {
    color: '#FF2D55',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  deleteInfo: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 10,
  },
});

export default AddressesScreen;
