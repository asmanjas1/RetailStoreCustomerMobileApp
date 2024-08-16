import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, KeyboardAvoidingView, Platform, FlatList, 
  SafeAreaView, 
  TouchableOpacity} from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
const GOOGLE_API_KEY = 'AIzaSyBfvPwGA0dBBwwADiWm3GbQ8b9HFFECbkg';

const LocationSelector = () => {
  const [address, setAddress] = useState(null);
  const googlePlacesRef = useRef(null);

  useEffect(() => {
    handleSelectCurrentLocation();
  }, []);

  const handleSelectCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
      const result = await getAddress(loc.coords);
      setAddress(result.formattedAddress);
      if (googlePlacesRef.current && result.formattedAddress) {
        googlePlacesRef.current.setAddressText('type');
        googlePlacesRef.current.setAddressText(result.formattedAddress);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while fetching the location.');
    }
  };

  const getAddress = async (coords) => {
    try {
      const [result] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      return result;
    } catch (error) {
      Alert.alert('Error', 'Failed to get address details with reverse GeoCode.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <FlatList
          data={[{ key: 'map' }]}
          renderItem={() => (
            <View style={styles.container}>
              <GooglePlacesAutocomplete
                placeholder="Search for a location"
                minLength={5}
                fetchDetails={true}
                ref={googlePlacesRef}
                onFail={(error) => {
                  Alert.alert('Error', 'Failed to Get location');
                }}
                onNotFound ={(error) => {alert('hqwi')
                  Alert.alert('Error', 'Location not found');
                }}
                onPress={(data, details = null) => {
                  if (details) {
                    setAddress(details.formatted_address);
                  }
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: 'en',
                  components: 'country:in',
                }}
                styles={{
                  textInputContainer: styles.textInputContainer,
                  textInput: styles.textInput,
                  listView: styles.listView,
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={1000}
                enablePoweredByContainer={false}
                currentLocationIconColor="#00a680"
                keyboardShouldPersistTaps="handled" 
              />
              
              
            </View>
          )}
          keyExtractor={(item) => item.key}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  container: {
   // backgroundColor: '#f5f5f5',
  },
  textInputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  textInput: {
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
  },
  listView: {
    backgroundColor: '#fff',
    elevation: 2,
  }
});

export default LocationSelector;
