import { ActivityIndicator, Alert, AppState, BackHandler, Linking, Platform, Pressable, StyleSheet } from "react-native";
import { ScrollView, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAPIUrl, getMapApi } from "../utils/AppUtils";
import axios from "axios";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from 'expo-location';
import { Button } from "react-native";
import { getAddress } from "../components/LocationSelector";

const AddressSelectionScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [googleAutoCompleteInputValue, setgoogleAutoCompleteInputValue] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [locationStatus, setlocationStatus] = useState(null);
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                checkLocationPermission();
            }
            setAppState(nextAppState);
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [appState]);

    useEffect(() => {
        const processCurrentAddressLogic = async () => {
            const currAddress = await AsyncStorage.getItem('currAddress');
            if (currAddress) {
                navigation.setOptions({
                    headerBackTitleVisible: false,
                });
            } else {
                navigation.setOptions({
                    headerLeft: () => null,
                    gestureEnabled: false,
                    headerBackTitleVisible: false,
                });
                const backHandler = BackHandler.addEventListener(
                    'hardwareBackPress',
                    () => {
                        return true;
                    }
                );
                return () => backHandler.remove();
            }
        }
        processCurrentAddressLogic();
        fetchAddresses();
        checkLocationPermission();
    }, [navigation]);

    const checkLocationPermission = async () => {
        const { status } = await Location.getForegroundPermissionsAsync();
        setlocationStatus(status);
    }

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

    const openAppSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    const requestLocationPermission = async () => {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        setlocationStatus(status);
        if (status === 'granted') {
            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });
            const result = await getAddress(loc.coords);
            setIsLoading(false);
            result['longitude'] = loc.coords.longitude;
            result['latitude'] = loc.coords.latitude
            AsyncStorage.setItem('currAddress', JSON.stringify(result));
            navigation.navigate("MainScreen", { fromAddressSelectionScreen: true });
        } else if (status === 'denied') {
            setIsLoading(false);
            Alert.alert("Error", 'Location permission was denied. You need to enable it manually in settings.');
        } else {
            setIsLoading(false);
            Alert.alert("Error", 'Error while fetching current location, try again.');
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
    return (
        <>
            <GooglePlacesAutocomplete
                placeholder="Search location"
                minLength={5}
                fetchDetails={true}
                onFail={(error) => {
                    Alert.alert('Error', 'Failed to Get location');
                }}
                onNotFound={(error) => {
                    Alert.alert('Error', 'Location not found');
                }}
                onPress={(data, details = null) => {
                    const addressComponents = details.address_components;
                    const getComponent = (type) => {
                        return addressComponents.find(component => component.types.includes(type))?.long_name || '';
                    };
                    let address = {
                        city: getComponent('locality') || getComponent('administrative_area_level_2'),
                        state: getComponent('administrative_area_level_1'),
                        locality: getComponent('sublocality_level_1') || getComponent('sublocality'),
                        pincode: getComponent('postal_code'),
                        longitude: details.geometry.location.lng,
                        latitude: details.geometry.location.lat
                    }
                    AsyncStorage.setItem('currAddress', JSON.stringify(address));
                    navigation.navigate("MainScreen", { fromAddressSelectionScreen: true });
                }}
                textInputProps={{
                    onChangeText: (text) => {
                        setgoogleAutoCompleteInputValue(text);
                    }
                }}
                query={{
                    key: getMapApi(),
                    language: 'en',
                    components: 'country:in',
                }}
                styles={{
                    container: {
                        flex: googleAutoCompleteInputValue ? 2 : 0.15
                    },
                    textInputContainer: {
                        marginTop: 10,
                        borderRadius: 10,
                        borderColor: '#ddd',
                    },
                    textInput: {
                        height: 50,
                        borderColor: '#ddd',
                        borderWidth: 1,
                        borderRadius: 10,
                        fontSize: 16,
                        marginHorizontal: 10,
                    },
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={1000}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps="handled"
            />
            {!googleAutoCompleteInputValue &&
                <>
                    <Pressable style={styles.item} onPress={requestLocationPermission}>
                        <MaterialIcons name="my-location" size={24} color="#D7263D" />
                        <Text style={styles.itemText}>Use Current Location</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="#D7263D" />
                    </Pressable>
                    <Text >Enable your current location for better services</Text>
                    {locationStatus === "denied" &&
                        <>
                            <Text >Location access was denied, please enable it in settings</Text>
                            <Button title="Open Settings" mode="contained" onPress={openAppSettings} />
                        </>
                    }
                    {addresses.length > 0 &&
                        <View style={{ margin: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: "500" }}>
                                Saved Address
                            </Text>
                        </View>}
                    <ScrollView scrollEnabled={true} >
                        {addresses?.map((item, index) => {
                            return (
                                <Pressable
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 15,
                                        paddingHorizontal: 20,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#EDEDED',
                                    }}
                                    onPress={() => {
                                        AsyncStorage.setItem('currAddress', JSON.stringify(item));
                                        navigation.navigate("MainScreen", { fromAddressSelectionScreen: true });
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
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                </>
            }
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        marginLeft: 15,
    },
});

export default AddressSelectionScreen;