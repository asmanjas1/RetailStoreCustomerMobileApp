import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions, Modal } from 'react-native';

const YourComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // Sample data for horizontal scrolling
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModalVisible(true)} style={styles.openButton}>
        <Text style={styles.buttonText}>Open Modal</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>Horizontal Scroll Items</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
            >
              {items.map((item) => (
                <View key={item.id} style={[styles.box, { backgroundColor: item.color }]} />
              ))}
            </ScrollView>

            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#0066b2',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollViewContent: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  box: {
    width: 100,
    height: 100,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff5c5c',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default YourComponent;
