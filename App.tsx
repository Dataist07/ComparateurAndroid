import { StatusBar } from 'expo-status-bar';
import MainContainer from './navigation/MainContainer';
import store from './store/store';
import {Provider, useSelector} from 'react-redux';
import { addDoc } from 'firebase/firestore'
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { 
  View, 
  SafeAreaView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
// redux persist
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import { cartRef } from './component/firebaseConfig';
let persistor = persistStore(store);





export default function App() {

  return(
    
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{flex: 1}}>
              <MainContainer />
              <StatusBar style="auto" />
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </PersistGate>
    </Provider>   
    );
  }
