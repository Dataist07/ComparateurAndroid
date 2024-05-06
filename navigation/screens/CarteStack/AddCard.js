import { View, Text, StyleSheet, TouchableOpacity,  TextInput,Image, Linking } from 'react-native';
import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from 'expo-camera';

const AddCards = () => {
    const [nameCard, setNameCard] = useState('');
    const [numCard, setNumCard] = useState('');
    const navigation = useNavigation();
    

    const handleAddCard = async () => {
        try {
            // Ensure numCard is set to an integer
            //const parsedNumCard = parseInt(numCard);

            // Retrieve the existing list of cards from AsyncStorage
            const storedListCards = await AsyncStorage.getItem('listCards');
            let listCards = [];

            // If there is an existing list, parse it from JSON
            if (storedListCards) {
                listCards = JSON.parse(storedListCards);
            }

            // Add the new card to the list
            listCards.push({ nameCard, numCard: numCard });

            // Save the updated list of cards to AsyncStorage
            await AsyncStorage.setItem('listCards', JSON.stringify(listCards));

            // Navigate to the next screen
            navigation.navigate("Liste des cartes");
            console.log(listCards)
           
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    return (
        <View style={styles.container}>

            <TextInput
                value={nameCard}
                style={styles.input}
                placeholder="Nom de la carte" // French placeholder text
                onChangeText={setNameCard}
                multiline={true} // Allow multiple lines for body content
                placeholderTextColor="#aaa" // Faded placeholder text
            />
           
            <TextInput
                value={numCard}
                style={styles.input}
                placeholder="Numero de la carte" // French placeholder text
                onChangeText={text => setNumCard(text.replace(/[^0-9]/g, ''))} // Allow only numbers
                keyboardType="numeric" // Show numeric keyboard
                placeholderTextColor="#aaa" // Faded placeholder text
            />

            <TouchableOpacity
                onPress={handleAddCard}
                style={styles.button}
            >
                <Text style={styles.infoText}>Enregistrer la carte</Text>
            </TouchableOpacity>
        
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8, // Rounded corners
        padding: 10,
        backgroundColor: '#fff',
        },
    button: {
        backgroundColor: '#FCC908',
        borderRadius: 7,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginVertical: 5,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        color: "#1E262F",
        fontWeight: '700',
    },
});

export default AddCards;
