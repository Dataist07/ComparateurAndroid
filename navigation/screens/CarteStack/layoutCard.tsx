import { View, Text, Button,ActivityIndicator, StyleSheet,TextInput,TouchableOpacity,ScrollView} from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState,useCallback } from "react";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { cardBanner } from '../../../component/idAdmob';

const adUnitId = __DEV__ ? TestIds.BANNER : cardBanner;
const ListCard = ({ route }) =>{


    const [listCards, setListCards] = useState([]);
  
    const navigation = useNavigation();
    
    const fetchListCards = async () => {
      
        const storedListCards = await AsyncStorage.getItem('listCards');
        if (storedListCards) {
            const parsedListCards = JSON.parse(storedListCards);
            setListCards(parsedListCards);
        }
   
    };

    useFocusEffect(
        useCallback(() => {
            fetchListCards();
            console.log(listCards)  
        }, [])
    );

    const handleCardPress = (nameCard) => {
        navigation.navigate("Cartes", {nameCard});
    };

    const handleAjouterCarte = async () => {
        navigation.navigate("Ajouter une carte");
    };
return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
            {listCards.map((card, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleCardPress(card.nameCard)}
                    style={styles.button}
                >
                    <Text style={styles.infoText}>{card.nameCard}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                onPress={handleAjouterCarte}
                style={styles.button}
            >
                <Text style={styles.infoText}>Ajouter une carte</Text>
            </TouchableOpacity>
        
        </View>
        <BannerAd 
            unitId={adUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
            requestNonPersonalizedAdsOnly: true
            }}
        />
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-arround',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button:{
        backgroundColor:'#FCC908',
        borderRadius:7,
        marginHorizontal:10,
        marginVertical:20,
        paddingVertical:5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        width:150
      },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        color: "#1E262F",
        fontWeight: '700',
    
    },
  
});

export default ListCard;