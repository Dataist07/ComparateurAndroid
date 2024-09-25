import { configureStore } from "@reduxjs/toolkit";
import storage from '@react-native-async-storage/async-storage';
import { 
  persistStore, 
  persistReducer, 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from "redux-persist";
//import thunk from 'redux-thunk';
//import {combineReducers} from 'redux';

import cartReducer from "./CartSlice";

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

const store = configureStore({
  reducer: { cart:persistedReducer},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware ( {
      serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store; 

export type RootState = ReturnType<typeof store.getState>;