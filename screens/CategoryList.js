// src/components/CategoryList.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const categories = [
  { id: '1', name: 'Groceries', icon: 'local-grocery-store' },
  { id: '2', name: 'Beverages', icon: 'local-drink' },
  { id: '3', name: 'Snacks', icon: 'fastfood' },
  { id: '4', name: 'Personal Care', icon: 'spa' },
  // Add more categories as needed
];

const CategoryList = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.categoryItem}>
          <Icon name={category.icon} size={30} color="green" />
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
});

export default CategoryList;
