import React, { useLayoutEffect } from 'react';
import { Image, ImageBackground, Platform, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreenStore = ({ navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerTitleAlign: 'center',
            headerBackground: () => (
                <ImageBackground
                    source={require('../assets/header-background.jpg')}
                    style={{ width: '100%', height: '100%' }}
                />
            ),
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('Settings')}>
                    <MaterialIcons name="account-circle" size={40} />
                </TouchableOpacity>
            ),
            headerStyle: {
                height: 90,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation]);

    return (
        <>
            <SafeAreaView
                style={{
                    paddingTop: Platform.OS === "android" ? 40 : 0,
                    flex: 1,
                    backgroundColor: "white",
                }}
            >

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    userIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    headerContainer: {
        width: '100%',
        height: 100, // Adjust height as needed
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'relative',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconButton: {
        position: 'absolute',
        right: 20,
        top: 30, // Adjust position as needed
    },
});

export default HomeScreenStore;
