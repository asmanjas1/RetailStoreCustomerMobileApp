import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Button, Platform, Text, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { getAPIUrl } from '../utils/AppUtils';

const StoreScreen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStoreDetails();
    });
    return unsubscribe;
  }, [navigation]);

  const [storeObject, setstoreObject] = useState({
    "storeName": "",
    "openingHours": "",
    "closingHours": "",
    "addressLine1": "",
    "addressLine2": "",
    "locality": "",
    "landmark": "",
    "city": "",
    "state": "",
    "pincode": "",
    "longitude": "",
    "latitude": "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStoreDetails = async () => {
    setIsLoading(true);
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    axios.get(getAPIUrl("storeservice") + `/store/getStoreByPersonId/${user.phoneNumber}`)
      .then(response => {
        setstoreObject(response.data);
        setIsLoading(false);
      }).catch(error => {
        setIsLoading(false);
        console.log("error", error);
      })
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    axios.post(getAPIUrl("storeservice") + `/store/add/${user.phoneNumber}`, storeObject)
      .then((response) => {
        setIsLoading(false);
        Alert.alert("Success", "Details Updated");
      }).catch((error) => {
        setIsLoading(false);
        Alert.alert("Error", "Failed to add store details");
        console.log("error", error);
      })
  };

  const handleInputChange = (name, value) => {
    setstoreObject((prevStore) => ({
      ...prevStore,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={24} color="#007BFF"/>
            <Text style={styles.infoText}>Add Store details and Address to start getting Orders</Text>
          </View>
          <Card style={[styles.card, styles.cardMarginTop]}>
            <Card.Title title="Basic Details" titleStyle={styles.title} />
            <Card.Content>
              <Text style={styles.label}>Store Name</Text>
              <TextInput
                style={styles.input}
                value={storeObject.storeName}
                onChangeText={(text) => handleInputChange('storeName', text)}
                placeholder="Enter store name"
              />
              <Text style={styles.label}>Opening Hours</Text>
              <TextInput
                style={styles.input}
                value={storeObject.openingHours}
                onChangeText={(text) => handleInputChange('openingHours', text)}
                placeholder="Enter opening hours (e.g., 09:00)"
              />
              <Text style={styles.label}>Closing Hours</Text>
              <TextInput
                style={styles.input}
                value={storeObject.closingHours}
                onChangeText={(text) => handleInputChange('closingHours', text)}
                placeholder="Enter closing hours (e.g., 18:00)"
              />
            </Card.Content>
            <Card.Actions>
              <Button
                title="Save"
                mode="contained" onPress={handleSubmit} style={styles.button} />
            </Card.Actions>
          </Card>
          <Card style={[styles.card, styles.cardMarginTop]}>
            <Card.Title title="Store Address" titleStyle={styles.title} />
            <Card.Content>
              {storeObject && storeObject.addressLine1 ?
                <>
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                  >
                    <Entypo name="location-pin" size={24} color="red" />
                    <Text style={{ fontSize: 13 }}>
                      {storeObject?.addressLine1} {storeObject?.addressLine2},{storeObject?.landmark}
                      {storeObject?.locality} {storeObject?.city} {storeObject?.state}
                    </Text>
                  </View>
                </>
                :
                <></>
              }
            </Card.Content>
            <Card.Actions>
              <Button
                title="Add Store Address"
                mode="contained" onPress={() => { navigation.navigate("AddAddress") }}
                style={styles.button} />
            </Card.Actions>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  cardMarginTop: {
    marginTop: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  infoBox: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#b3d7ff',    
    alignSelf: 'stretch'
  },
  infoText: {
    marginLeft: 10,
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '500',
    flexWrap: 'wrap',
    flexShrink: 1
  },
});

export default StoreScreen;
