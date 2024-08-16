import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let bestLocation = null;
      let accuracyThreshold = 5; // In meters
      let attempts = 0;
      const maxAttempts = 10;
  
      while (attempts < maxAttempts) {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        if (!bestLocation || loc.coords.accuracy < bestLocation.coords.accuracy) {
          bestLocation = loc;
        }
  
        if (bestLocation.coords.accuracy <= accuracyThreshold) {
          break;
        }
  
        attempts += 1;console.log(attempts, bestLocation)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before the next attempt
      }
  
      console.log(bestLocation);
      getAddress(bestLocation.coords);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching the location.');
      setErrorMsg(error.message);
    }
  };

const getAddress = async (coords) => {
    try {
      const [result] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      console.log(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to get address details.');
      console.error(error);
    }
  };


// Call getLocation when needed
