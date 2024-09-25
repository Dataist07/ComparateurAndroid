import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Barcode from 'react-native-barcode-svg';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { cardBanner } from "../../../component/idAdmob";

const adUnitId = __DEV__ ? TestIds.BANNER : cardBanner;
const Cards = ({ route }) => {
    const { nameCard } = route.params;
    const [numCard, setNumCard] = useState('');
    const navigation = useNavigation();

    const fetchListCards = async () => {
        try {
            const storedListCards = await AsyncStorage.getItem('listCards');
            if (storedListCards) {
                const parsedListCards = JSON.parse(storedListCards);
                const card = parsedListCards.find(card => card.nameCard === nameCard);
                if (card) {
                    setNumCard(card.numCard);
                }
            }
        } catch (error) {
            console.error('Error fetching list of cards:', error);
        }
    };

    useEffect(() => {
        fetchListCards();
    }, []);

    const handleDeleteCard = async () => {
        try {
            const storedListCards = await AsyncStorage.getItem('listCards');
            if (storedListCards) {
                let parsedListCards = JSON.parse(storedListCards);
            
                // Show confirmation alert
                Alert.alert(
                    'Confirmation',
                    'Êtes-vous sûr de vouloir supprimer cette carte ?',
                    [
                        {
                            text: 'Annuler',
                            style: 'cancel',
                        },
                        {
                            text: 'Supprimer',
                            onPress: async () => {

                                // Filter out the card to be deleted
                                parsedListCards = parsedListCards.filter(card => card.nameCard !== nameCard);
                                // Update AsyncStorage with the filtered list
                                await AsyncStorage.setItem('listCards', JSON.stringify(parsedListCards));
                                // Navigate to the next screen
                                navigation.navigate("Liste des cartes");
                            },
                        },
                    ]
                );
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{nameCard}</Text>
            {numCard ? <Barcode value={numCard} format="CODE128" /> : null}
            <Text style={styles.infoText}>{numCard}</Text>
            <View style={styles.container2}>
                <TouchableOpacity onPress={handleDeleteCard} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Supprimer la carte</Text>
                </TouchableOpacity>
            </View>
            <BannerAd 
                unitId={adUnitId}
                size={BannerAdSize.FULL_BANNER}
                requestOptions={{
                requestNonPersonalizedAdsOnly: true
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        backgroundColor: "#fff",
    },
    container2: {
        marginTop:250,
        marginBottom:50
    },
    title:{
        fontSize: 30,
        textAlign: 'center',
        color: "#1E262F",
        fontWeight: '700',
        marginVertical: 20,
    },
    infoText: {
        fontSize: 18,
        textAlign: 'center',
        color: "#1E262F",
        fontWeight: '700',
        marginVertical: 10,
    },
    deleteButton: {
       
        backgroundColor: '#FCC908',
        borderRadius:7,
        marginHorizontal:10,
        paddingHorizontal:5,
        paddingVertical:5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        marginTop: 20,
    },
    deleteButtonText: {
        color: '#1E262F',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Cards;
