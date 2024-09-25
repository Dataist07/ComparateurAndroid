import { View, Text, Button,ActivityIndicator, StyleSheet,TextInput,TouchableOpacity,Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FirebaseAuth} from '../../../component/firebaseConfig';
import { getAuth, deleteUser } from "firebase/auth";
import email from 'react-native-email'
import React, { useEffect, useState } from "react";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1082484914143239/2328590649';
const Account = () =>{
   
    //const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const handleSendEmail = async () => {
        const to = ['compar0797@gmail.com']; // Replace with dynamic recipient if needed
    
        try {
            await email(to, {
                subject : 'Avis client',
                body: body,
                checkCanOpen: false, // Avoid unnecessary check (optional)
            });
            console.log('Email composition successful!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
        }
    };

    const handleDeletUser = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        

        // Show confirmation alert
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer ce compte ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Supprimer',
                    onPress: () => {

                        deleteUser(user).then(() => {
                            // User deleted.
                          }).catch((error) => {
                            // An error ocurred
                            // ...
                          });
                    },
                },
            ]
        );

    };
return (
    <View style={styles.container}>
        <Text style={styles.title}>Écrivez-nous</Text>

        <TextInput
        value={body}
        style={styles.input}
        placeholder="Message" // French placeholder text
        onChangeText={setBody}
        multiline={true} // Allow multiple lines for body content
        placeholderTextColor="#aaa" // Faded placeholder text
        />

        <TouchableOpacity 
            onPress={handleSendEmail} style={styles.button} >
            <Text style={styles.infoText} >Envoyer le message</Text>
        </TouchableOpacity>


        {/* Disconnect button with improved styling */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
                onPress={() => FirebaseAuth.signOut()} style={styles.button} >
                <Text style={styles.infoText} >Déconnexion</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={handleDeletUser} style={styles.buttonDelete} >
                <Text style={styles.infoText} >Supprimer le compte</Text>
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
    },
    title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop:150
    },
    input: {
    marginVertical: 10,
    height: 100,
    
    borderWidth: 1,
    borderRadius: 8, // Rounded corners
    padding: 10,
    backgroundColor: '#fff',
    },
    button:{
        backgroundColor:'#FCC908',
        borderRadius:7,
        marginHorizontal:10,
        paddingHorizontal:5,
        paddingVertical:5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        marginTop:40
      },
      buttonDelete:{
        backgroundColor:'#ff0000',
        borderRadius:7,
        marginHorizontal:10,
        paddingHorizontal:5,
        paddingVertical:5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        marginTop:40
      },
      infoText: {
        fontSize: 16,
        textAlign: 'center',
        color: "#1E262F",
        fontWeight: '700',
        
      },
    buttonContainer: {
        marginTop: 150,
        marginBottom:50,
    },
});

export default Account;