import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import LocationSelector from '../components/LocationSelector';
import CategoryList from './CategoryList';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <LocationSelector />
      <TextInput style={styles.searchBar} placeholder="Search products..." />
      <CategoryList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
