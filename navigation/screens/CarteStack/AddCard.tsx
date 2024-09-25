import { View, Text, StyleSheet, TouchableOpacity,  TextInput,Button,Alert,ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { cardInter } from '../../../component/idAdmob';


const adInterId = __DEV__ ? TestIds.INTERSTITIAL : cardInter;

const interstitial = InterstitialAd.createForAdRequest(adInterId , {
  requestNonPersonalizedAdsOnly: true
});

const AddCards = () => {
    //interstital
    const [interstitialLoaded, setInterstitialLoaded] = useState(false);

    const loadInterstitial = () => {
      const unsubscribeLoaded = interstitial.addAdEventListener(
        AdEventType.LOADED,
        () => {
          setInterstitialLoaded(true);
        }
      );
  
      const unsubscribeClosed = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          setInterstitialLoaded(false);
          interstitial.load();
        }
      );
  
      interstitial.load();
  
      return () => {
        unsubscribeClosed();
        unsubscribeLoaded();
      }
    }
  
    useEffect(() => {
      const unsubscribeInterstitialEvents = loadInterstitial();
  
      return () => {
        unsubscribeInterstitialEvents();
      };
    }, [])

    const [nameCard, setNameCard] = useState('');
    const [numCard, setNumCard] = useState('');
    const navigation = useNavigation();
    
    const handleAddCard = async () => {
        try {
            // Check if nameCard or numCard is empty
            if (!nameCard.trim() || !numCard.trim()) {
                // If any field is empty, display an alert
                Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
                return;
            }
            // Retrieve the existing list of cards from AsyncStorage
            const storedListCards = await AsyncStorage.getItem('listCards');
            let listCardsToStore = [];

            // If there is an existing list, parse it from JSON
            if (storedListCards) {
                listCardsToStore = JSON.parse(storedListCards);
            }

            // Add the new card to the list
            listCardsToStore.push({ nameCard, numCard: numCard });

            // Save the updated list of cards to AsyncStorage
            await AsyncStorage.setItem('listCards', JSON.stringify(listCardsToStore));

            // Navigate to the next screen
            navigation.navigate("Liste des cartes", {listCardsToStore});
          
           
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    //Barcode scanner
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        setNumCard(data);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }


    return (
        <View style={styles.container}>
            <View style={styles.containerCamera}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
                {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            </View>
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
                onChangeText={setNumCard} // Allow only numbers
                multiline={true} // Allow multiple lines for body content
                placeholderTextColor="#aaa" // Faded placeholder text
            />

            {//interstitialLoaded ? 
                <TouchableOpacity
                    onPress={() =>{ 
                        
                        handleAddCard(); 
                        //interstitial.show();
                    }} 
                   
                    style={styles.button}
                >
                    <Text style={styles.infoText}>Enregistrer la carte</Text>
                </TouchableOpacity>
              //: <ActivityIndicator/>
            }  
        
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    containerCamera:{
        flex: 1,
        paddingHorizontal: 10,
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
        marginHorizontal: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        marginVertical: 5,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        color: "#1E262F",
        fontWeight: '700',
    },
    //Camera
    camera: {
        flex: 1,
      },

      
});

export default AddCards;
