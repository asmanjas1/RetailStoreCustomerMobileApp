import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    FlatList,
    SafeAreaView,
    Platform,
    Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import { Ionicons } from '@expo/vector-icons';
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddressScreen = () => {
    const navigation = useNavigation();
    const [addressLine1, setaddressLine1] = useState("");
    const [addressLine2, setaddressLine2] = useState("");
    const [locality, setlocality] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setcity] = useState("");
    const [state, setstate] = useState("");
    const [pincode, setpincode] = useState("");
    const [latitude, setlatitude] = useState();
    const [longitude, setlongitude] = useState();
    const [googleObject, setgoogleObject] = useState(null);
    const [googleAutoCompleteInputValue, setgoogleAutoCompleteInputValue] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const validateForm = () => {
        const newErrors = {};
        if (!addressLine1) newErrors.addressLine1 = 'required';
        if (!addressLine2) newErrors.addressLine2 = 'required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleAddAddress = async () => {
        if (validateForm()) {
            const address = {
                addressLine1,
                addressLine2,
                locality,
                landmark,
                city,
                state,
                pincode,
                longitude,
                latitude,
                googleObject
            }
            let user = await AsyncStorage.getItem('user');
            user = JSON.parse(user);
            axios.post(`https://retailstorecloudbase.el.r.appspot.com/v1/address/save/${user.phoneNumber}`, address)
                .then((response) => {
                    setModalVisible(false);
                    Alert.alert("Success", "Addresses added successfully");
                    setaddressLine1("");
                    setaddressLine2("");
                    setlocality("");
                    setLandmark("");
                    setcity("");
                    setstate("");
                    setpincode("");
                    setlongitude("");
                    setlatitude("");
                    setgoogleObject(null);
                    setTimeout(() => {
                        navigation.navigate("MainScreen", {comingFrom: 'Address'});
                    }, 500);
                }).catch((error) => {
                    setModalVisible(false);
                    Alert.alert("Error", "Failed to add address");
                    console.log("error", error);
                })
        }
    }

    const handleLocationSelect = (data, details = null) => {
        if (details) {
            const addressComponents = details.address_components;
            const getComponent = (type) => {
                return addressComponents.find(component => component.types.includes(type))?.long_name || '';
            };
            setcity(getComponent('locality') || getComponent('administrative_area_level_2'));
            setstate(getComponent('administrative_area_level_1'));
            setlocality(getComponent('sublocality_level_1') || getComponent('sublocality'));
            setpincode(getComponent('postal_code'));
            setlongitude(details.geometry.location.lng);
            setlatitude(details.geometry.location.lat);
            setgoogleObject(JSON.stringify(details));
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
                <Text style={{ fontSize: 15, fontWeight: "bold", paddingTop: 20, textAlign: "center" }}>
                    Search city and locality
                </Text>
                <FlatList
                    data={[{ key: 'map' }]}
                    renderItem={() => (
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
                            onPress={handleLocationSelect}
                            textInputProps={{
                                onChangeText: (text) => {
                                    setgoogleAutoCompleteInputValue(text);
                                }
                            }}
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en',
                                components: 'country:in',
                            }}
                            styles={{
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
                                    flexWrap: "wrap"
                                },
                                listView: {
                                    backgroundColor: '#fff',
                                },
                            }}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            debounce={1000}
                            enablePoweredByContainer={false}
                            currentLocationIconColor="#00a680"
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                    keyExtractor={(item) => item.key}
                    keyboardShouldPersistTaps="handled"
                />
                <Pressable
                    onPress={() => {
                        if (!googleAutoCompleteInputValue) {
                            Alert.alert("Required", "Please select location first");
                        } else {
                            setModalVisible(true);
                        }
                    }}
                    style={{
                        backgroundColor: "green",
                        padding: 20,
                        margin: 10,
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "bold" }}>Add more address details</Text>
                </Pressable>
            </SafeAreaView>

            <BottomModal
                onBackdropPress={() => setModalVisible(!modalVisible)}
                swipeDirection={null}
                avoidKeyboard={true}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }
                modalStyle={{
                    bottom: Platform.OS === 'ios' ? keyboardHeight : 0,
                }}
                onHardwareBackPress={() => { return true }
                }
                visible={modalVisible}
            >
                <ModalContent style={{ width: "100%" }}>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons name="close" size={24} color="black" />
                    </Pressable>
                    <ScrollView style={{ marginTop: 10 }} keyboardShouldPersistTaps={'handled'}>
                        <View style={{ padding: 10 }}>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                    Flat, House No, Building, Company
                                </Text>
                                <TextInput
                                    value={addressLine1}
                                    onChangeText={(text) => setaddressLine1(text)}
                                    placeholderTextColor={"black"}
                                    style={{
                                        padding: 10,
                                        borderColor: "#D0D0D0",
                                        borderWidth: 1,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}
                                    placeholder=""
                                />
                                {errors.addressLine1 && <Text style={styles.errorText}>{errors.addressLine1}</Text>}
                            </View>
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                    Area, Street, Sector, Village
                                </Text>
                                <TextInput
                                    value={addressLine2}
                                    onChangeText={(text) => setaddressLine2(text)}
                                    placeholderTextColor={"black"}
                                    style={{
                                        padding: 10,
                                        borderColor: "#D0D0D0",
                                        borderWidth: 1,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}
                                    placeholder=""
                                />
                                {errors.addressLine2 && <Text style={styles.errorText}>{errors.addressLine2}</Text>}
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Landmark</Text>
                                <TextInput
                                    value={landmark}
                                    onChangeText={(text) => setLandmark(text)}
                                    placeholderTextColor={"black"}
                                    style={{
                                        padding: 10,
                                        borderColor: "#D0D0D0",
                                        borderWidth: 1,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}
                                    placeholder="nearby landmark (optional)"
                                />
                            </View>

                            <Button
                                title="Save Address"
                                onPress={() => handleAddAddress()}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            />
                        </View>
                    </ScrollView>
                </ModalContent>
            </BottomModal>
        </>
    );
};

export default AddressScreen;

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    }
});