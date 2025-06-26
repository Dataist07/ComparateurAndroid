import { 
  View, 
  Text, 
  Button,
  ActivityIndicator, 
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {FirebaseAuth} from '../../../component/firebaseConfig';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';

import React, { useEffect, useState } from "react";

const Login = () =>{
    const navigation = useNavigation();
    const tryApplication = async () => {

        navigation.navigate("AppTry");
      };

    const [email, setEmail] = useState('') ;
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const auth = FirebaseAuth;

    const signIn = async () => {
        setLoading (true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Erreur connexion: ' + error.message);
        } finally { 
            setLoading (false);
        }
    };

    const signUp = async () => {
        setLoading (true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            //alert('Check your emails!');
        } catch (error) {
            console.log(error);
            alert('Erreur incription: ' + error.message);
        } finally { 
            setLoading (false);
        }
    };

    const handleForgotPassword = async () => {
      if (!email) {
        alert("Veuillez entrer votre email pour réinitialiser le mot de passe.");
        return;
      }
      try {
        await sendPasswordResetEmail(auth, email);
        alert("Un email de réinitialisation a été envoyé. Vérifiez votre dossier spam.");
      } catch (error) {
        alert("Erreur lors de la réinitialisation : " + error.message);
      }
    };
      
return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue !</Text>

     
      <TextInput
        value={email}
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text.trim())}
        placeholderTextColor="#aaa" // Faded placeholder text
      />
      <TextInput
        value={password}
        secureTextEntry={true}
        style={styles.input}
        placeholder="Mot de passe"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text.trim())}
        placeholderTextColor="#aaa" // Faded placeholder text
      />
      {createAccount? (
        <View>
          <TextInput
            value={confirmationPassword}
            secureTextEntry={true}
            style={styles.input}
            placeholder="Confirmer votre mot de passe"
            autoCapitalize="none"
            onChangeText={(text) => setConfirmationPassword(text.trim())}
            placeholderTextColor="#aaa" // Faded placeholder text
          />
        
        </View>
      ) :  (
        <View>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={{ color: '#007AFF', textAlign: 'right', marginBottom: 10 }}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
      ) : (
        <View style={styles.buttonContainer}>

          <TouchableOpacity 
            onPress={() => {
              if (!createAccount) {
                signIn();             
              } else {
                setCreateAccount(false);
              }
            }} 
            style={styles.buttonConnection} >
            <Text style={styles.infoText} >Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              if (!createAccount) {
                setCreateAccount(true);
              } else {
                if (password !== confirmationPassword) {
                  alert("Mot de passe ne se correspond pas !");
                  return;
                }
                signUp();
              }
            }} 
            style={styles.buttonConnection} >
            <Text style={styles.infoText} >Créer un compte</Text>
          </TouchableOpacity>
        
        </View>
      )}

      <Text style={styles.textInformation}>Note: Pour pouvoir utiliser les fonctions liste de courses et cartes de fidélités, veuillez créer un compte ou vous connecter.</Text>

      <TouchableOpacity 
        onPress={tryApplication} style={styles.buttonFiltre} >
        <Text style={styles.infoText} >Essayer l'application (sans compte)</Text>
      </TouchableOpacity>
    </View>
  </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    },
    title: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    },
    input: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    },
    activityIndicator: {
    marginTop: 20,
    },
    buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    //marginBottom: 20,
    },
    buttonConnection:{
   
      backgroundColor:'#FFDB14',
      borderRadius:7,
      marginHorizontal:10,
      paddingHorizontal:10,
      paddingVertical:5,
      alignItems: 'center',
      justifyContent: 'center',
      height: 52,
      borderColor: "#1E262F",
      borderWidth: 1,
    },

    buttonFiltre:{
      marginTop: 30,
      backgroundColor:'#FFDB14',
      borderRadius:7,
      marginHorizontal:10,
      paddingHorizontal:5,
      paddingVertical:5,
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      borderColor: "#1E262F",
      borderWidth: 1,
     
    },
    infoText: {
      fontSize: 16,
      textAlign: 'center',
      color: "#1E262F",
      fontWeight: '700',
      
    },
    textInformation: {
      marginTop:50,
      fontSize: 16,
      textAlign: 'center',
      color: "#1E262F",
      fontWeight: '700',
      
    },
});

export default Login;