import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View, StyleSheet, TextInput, SafeAreaView, ScrollView, Platform, Pressable,
  Text, Button, Modal, Dimensions,
  ImageBackground,
  Animated,
  ActivityIndicator,
  FlatList
} from 'react-native';
import CategoryList from './CategoryList';
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAPIUrl } from '../utils/AppUtils';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';

const HomeScreenCustomer = ({ navigation }) => {
  const route = useRoute();
  const [selectedAddress, setselectedAddress] = useState(null);
  const [customerHomeScreenLoaderActive, setcustomerHomeScreenLoaderActive] = useState(false);
  const [customerHomeScreenStoreAvailableMsg, setcustomerHomeScreenStoreAvailableMsg] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Buy Items',
      headerTitleAlign: 'center',
      headerBackground: () => (
        <ImageBackground
          source={require('../assets/header-background.jpg')}
          style={{ width: '100%', height: '100%' }}
        />
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="account-circle" size={40} />
        </TouchableOpacity>
      ),
      headerStyle: {
        height: 90,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.fromAddressSelectionScreen) {
        navigation.setParams({ fromAddressSelectionScreen: false });
        setInitialAddress();
      }
    });
    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      navigation.navigate('AddressSelectionScreen');
    } else {
      setInitialAddress();
    }
  };

  const setInitialAddress = async () => {
    let currAddress = await AsyncStorage.getItem('currAddress');console.log(currAddress);
    if(currAddress){
      currAddress = JSON.parse(currAddress);
      setselectedAddress(currAddress);
      fetchApplicableStoreDetails(currAddress.longitude, currAddress.latitude);
    } else {
      navigation.navigate('AddressSelectionScreen');
    }
  }

  const fetchApplicableStoreDetails = (longitude, latitude) => {
    setcustomerHomeScreenLoaderActive(false);//
    axios.get(getAPIUrl('storeservice') + `/store/getNearestStore?longitude=${longitude}&latitude=${latitude}`)
    .then((response) => {
console.log(response.data);
    }).catch(error => {
      setcustomerHomeScreenStoreAvailableMsg("No Store available");
    })
  }

  const [cartItems, setCartItems] = useState(0);
  const addItemToCart = () => {
    setCartItems(cartItems + 1);
  };

  return (
    <>
      {customerHomeScreenLoaderActive ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        :
        <ScrollView>
          <View
            style={{
              backgroundColor: "#00CED1",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('AddressSelectionScreen');
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                padding: 10,
                backgroundColor: "#AFEEEE",
              }}
            >
              <Ionicons name="location-outline" size={24} color="black" />
              < >
                {selectedAddress && !selectedAddress.postalCode ? (
                  <>
                  <Text style={{ fontSize: 13, fontWeight: "500", width: 220 }} numberOfLines={1} ellipsizeMode="tail">
                    Deliver to {selectedAddress?.addressLine1} {selectedAddress?.locality} {selectedAddress?.city} {selectedAddress?.pincode}
                  </Text>
                  </>
                ) : (
                  <>
                  <Text style={{ fontSize: 13, fontWeight: "500", width: 220 }} numberOfLines={1} ellipsizeMode="tail">
                    Deliver to {selectedAddress?.street} {selectedAddress?.name} {selectedAddress?.district} {selectedAddress?.city} {selectedAddress?.subregion}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: "500" }}>{selectedAddress?.postalCode}</Text>
                  </>
                )}</>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </Pressable>
          </View>
          {customerHomeScreenStoreAvailableMsg == null ?
            <>
              <Pressable onPress={addItemToCart} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Item to Cart</Text>
              </Pressable>
            </>
            :
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text style={{ fontSize: 13, fontWeight: "500" }}>
                {customerHomeScreenStoreAvailableMsg}
              </Text>
            </View>
          }
        </ScrollView>
      }
      {cartItems > 0 && (
        <TouchableOpacity
          onPress={() => console.log('Floating Button Pressed')}
        >
          <View style={[styles.floatingCart]}>
            <MaterialIcons name="shopping-cart" size={24} color="#fff" />
            <Text style={styles.cartText}>Cart ({cartItems})</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreenCustomer;
