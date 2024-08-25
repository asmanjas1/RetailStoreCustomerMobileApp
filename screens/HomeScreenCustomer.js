import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, TextInput, SafeAreaView, ScrollView, Platform, Pressable,
  Text, Button, Modal, Dimensions
} from 'react-native';
import { fetchUserCurrentPosition, getAddress } from '../components/LocationSelector';
import CategoryList from './CategoryList';
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreenCustomer = ({navigation}) => {
  const [currentLocationObj, setcurrentLocationObj] = useState(null);
  const [selectedAddress, setselectedAddress] = useState(null);
  const [addressModalVisible, setaddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const parentNavigation = navigation.getParent();
      if(parentNavigation) {
        const routes = parentNavigation.getState() && parentNavigation.getState().routes ? parentNavigation.getState().routes : [] ;
        routes.forEach(item => {
          if(item && item.params && item.params.comingFrom && item.params.comingFrom == "Address") {
            fetchAddresses();
          }
        }
        );
      }
    });

    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addressModalVisible) {
      fetchAddresses();
    }
  }, [addressModalVisible]);

  const fetchcurrentLocation = async () => {
    let loc = await fetchUserCurrentPosition();
    const result = await getAddress(loc.coords);
    setcurrentLocationObj(result);
  }

  const fetchAddresses = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      user = JSON.parse(user);
      axios.post(
        `https://retailstorecloudbase.el.r.appspot.com/v1/address/getAllAddressById/${user.phoneNumber}`, {})
        .then(response => {
          let savedAddress = response.data;
          setAddresses(savedAddress);
          if(savedAddress && savedAddress.length > 0) {
            let selectedAddress = savedAddress.filter(add => { add.lastUsedForOrder });
            if(selectedAddress && selectedAddress.length > 0) {
              setselectedAddress(selectedAddress[0]);
            } else {
              setselectedAddress(savedAddress[0]);
            }
          } else {
            if(!addressModalVisible) {
              fetchcurrentLocation();
            }
          }
        }).catch(error => {
          if(!addressModalVisible) {
            fetchcurrentLocation();
          }
          console.log(error);
        });
    } catch (error) {
      if(!addressModalVisible) {
        fetchcurrentLocation();
      }
      console.log("error", error);
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ScrollView>
          <View
            style={{
              backgroundColor: "#00CED1",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Pressable
              onPress={() => setaddressModalVisible(!addressModalVisible)}
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
                {selectedAddress ? (
                  <Text style={{ fontSize: 13, fontWeight: "500" }}>
                    Deliver to {selectedAddress?.addressLine1} {selectedAddress.city}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 13, fontWeight: "500" }}>
                    Deliver to {currentLocationObj?.street} {currentLocationObj?.district} {currentLocationObj?.city}
                  </Text>
                )}</>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </Pressable>
          </View>
          <TextInput style={styles.searchBar} placeholder="Search products..." />
          <CategoryList />
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setaddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setaddressModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                Choose your Location
              </Text>

              <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
                Select a delivery location to see product availabilty and delivery
                options
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: "row", zIndex: 2000 }}
              scrollEnabled={true}
            >
              {addresses?.map((item, index) => (
                <Pressable
                  onPress={() => {
                    setselectedAddress(item);
                    setaddressModalVisible(false);
                  }}
                  style={{
                    width: 140,
                    height: 140,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                    marginRight: 15,
                    marginTop: 10,
                    backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
                  }}
                  key={index}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                      {item?.addressLine1}
                    </Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    {item?.addressLine2},{item?.landmark}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    {item?.locality}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    {item?.city},{item?.state}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              onPress={() => {
                setaddressModalVisible(false);
                navigation.navigate("Address", { comingFrom: 'Home' });
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Add an Address
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default HomeScreenCustomer;
