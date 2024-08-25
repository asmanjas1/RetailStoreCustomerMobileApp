import React from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, TextInput, Button, Platform } from 'react-native';
import LocationSelector from '../components/LocationSelector';
import ResponsiveComponent from './Test';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const StoreScreen = ({ navigation }) => {
  return (
    <>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={styles.container}>
          <Button
            title="Add Store Address"
            onPress={() => { navigation.navigate("Address") }}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>
      </SafeAreaView>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  }
});

export default StoreScreen;
