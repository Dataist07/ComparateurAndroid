
import React, { useEffect, useState } from "react";

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {User, onAuthStateChanged} from 'firebase/auth';

import {FirebaseAuth} from '../firebaseConfig';

// Screens
import SearchSupermarket from './screens/SearchSupermarket';
import SearchProducts from './screens/SearchProducts';
import PricePerSupermarket from './screens/PricePerSupermarket';
import ListCourses from './screens/ListProductsStack/ListPtoductsBySupermarket';
import ListProductsBySupermarket from './screens/ListProductsStack/ListPtoductsBySupermarket';
import Login from './screens/login';
import Account from "./screens/account";
import Filter from "./screens/SearchProductStack/Filter";
import SearchProductSupermarketFiltered from "./screens/SearchProductStack/SearchProductSupermarketFiltered";
import ListCard from "./screens/listCard";
import Cards from "./screens/CarteStack/Card";
import AddCards from "./screens/CarteStack/AddCard";

// stack
const SupermarketStack = createNativeStackNavigator();

function SupermarketsStack() {
  
  return (
    <SupermarketStack.Navigator>
      <SupermarketStack.Screen
        name="Trouvez vos supermarchés"
        component={SearchSupermarket}
      />

      <SupermarketStack.Screen
        name="Cherchez vos produits"
        component={SearchProductSupermarketFiltered}
      />

      <SupermarketStack.Screen
        name="Filter"
        component={Filter}
      />

      <SupermarketStack.Screen
        name="Trouvez vos produits"
        component={SearchProducts}
      />


    </SupermarketStack.Navigator>
  )
}

const ListProductStack = createNativeStackNavigator();

function ListProductsStack() {
  return (
    <ListProductStack.Navigator>
      <ListProductStack.Screen
        name="Comparateur"
        component={PricePerSupermarket}
      />
      <ListProductStack.Screen
        name="Liste de course"
        component={ListProductsBySupermarket}
      />
    </ListProductStack.Navigator>
  )
}

const CardStack = createNativeStackNavigator();

function CardsStack() {
  return (
    <CardStack.Navigator>
      <CardStack.Screen
        name="Liste des cartes"
        component={ListCard}
      />
      <CardStack.Screen
        name="Cartes"
        component={Cards}
      />
      
      <CardStack.Screen
        name="Ajouter une carte"
        component={AddCards}
      />
    </CardStack.Navigator>
  )
}

const ProfilStack = createNativeStackNavigator();

function ProfilsStack() {
  const [user, setUser] = useState(null);

  useEffect (() => {
    onAuthStateChanged (FirebaseAuth, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);
  return (
    <ProfilStack.Navigator>
      {user ?(
          <ProfilStack.Screen
            name="Account" // Consider a more descriptive name
            component={Account} // Wrap TabNavigator with Screen
            options={{ headerShown: false }}
          />
      ) : (
        <>
          <ProfilStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          
        </>
      )}
    </ProfilStack.Navigator>
  )
}

// Tab bottom
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name === "Supermarchés/Produits"){
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Liste de courses"){
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Cartes fidélités"){
            iconName = focused ? "card" : "card-outline";
          } else if (route.name === "Profil"){
            iconName = focused ? "person" : "person-outline";
          }
          
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Supermarchés/Produits" component={SupermarketsStack} options={{ headerShown: false }}/>
      <Tab.Screen name="Liste de courses" component={ListProductsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Cartes fidélités" component={CardsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profil" component={ProfilsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function TabNavigatorTry() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name === "Supermarchés/Produits"){
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profil"){
            iconName = focused ? "person" : "person-outline";
          }
          
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Supermarchés/Produits" component={SupermarketsStack} options={{ headerShown: false }}/>
      <Tab.Screen name="Profil" component={ProfilsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
// Main
export default function MainContainer() {
    const [user, setUser] = useState(null);

    useEffect (() => {
      onAuthStateChanged (FirebaseAuth, (user) => {
        console.log('user', user);
        setUser(user);
      });
    }, []);
    return (
        <NavigationContainer>
          <Stack.Navigator>

          {user ?(
                <Stack.Screen
                  name="App" // Consider a more descriptive name
                  component={TabNavigator} // Wrap TabNavigator with Screen
                  options={{ headerShown: false }}
                />
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen
                  name="AppTry" // Consider a more descriptive name
                  component={TabNavigatorTry} // Wrap TabNavigator with Screen
                  options={{ headerShown: false }}
                />
              </>
            )}
         
         </Stack.Navigator>
        </NavigationContainer>
    );
}