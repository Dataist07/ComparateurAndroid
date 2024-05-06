import { View, Text, Button,ActivityIndicator, StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FirebaseAuth} from '../../firebaseConfig';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword} from 'firebase/auth';
import email from 'react-native-email'
import React, { useEffect, useState } from "react";

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

        <View style={styles.spacer} />

        {/* Disconnect button with improved styling */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
                onPress={() => FirebaseAuth.signOut()} style={styles.button} >
                <Text style={styles.infoText} >Déconnexion</Text>
            </TouchableOpacity>
        </View>
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
    marginBottom: 20,
    textAlign: 'center',
    },
    input: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 8, // Rounded corners
    padding: 10,
    backgroundColor: '#fff',
    },
    button:{
        backgroundColor:'#FCC908',
        borderRadius:7,
        marginHorizontal:5,
        paddingHorizontal:10,
        paddingVertical:5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
      },
      infoText: {
        fontSize: 16,
        textAlign: 'center',
        color: "#1E262F",
        fontWeight: '700',
        
      },
    buttonContainer: {
        marginTop: 300,
    },
});

export default Account;