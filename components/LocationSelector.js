import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

const LocationSelector = () => {

  useEffect(() => {
    //handleSelectCurrentLocation();
  }, []);

  // const handleSelectCurrentLocation = async () => {
  //   let loc = await  fetchUserCurrentPosition();
  //   const result = await getAddress(loc.coords);
  //   setAddress(result.formattedAddress);
  //   if (googlePlacesRef.current && result.formattedAddress) {
  //     googlePlacesRef.current.setAddressText('type');
  //     googlePlacesRef.current.setAddressText(result.formattedAddress);
  //   }
  // }

  return (
    <></>
  );
};

export const fetchUserCurrentPosition = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest
    });
    return loc;
  } catch (error) {
    return;
  }
}

export const getAddress = async (coords) => {
  try {
    const [result] = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    return result;
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Failed to get address details with reverse GeoCode.');
  }
}

const styles = StyleSheet.create({
});

export default LocationSelector;
