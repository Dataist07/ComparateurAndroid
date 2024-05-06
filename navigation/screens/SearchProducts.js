import { useNavigation } from "@react-navigation/native";
import {View, Text, StyleSheet,SafeAreaView,Button,ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import SearchProductSupermarketFiltered from "./SearchProductStack/SearchProductSupermarketFiltered";
import { StatusBar } from 'expo-status-bar';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SearchProducts = ({ route }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();
  const { selectedDrives } = route.params; 
 

  useEffect(  () => {
    fetchData();
    
  }, []);


  const chunkAndStoreData = async (nom_drive, nom_driveUrl, dateScraped, data) => {
    const CHUNK_SIZE = 3000; // You can adjust the chunk size as needed
    const chunks = [];
    
    // Split the data into chunks
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      chunks.push(chunk);
      
    }

    // Store each chunk separately
    for (let i = 0; i < chunks.length; i++) {
      const chunkKey = `${nom_drive}_${i}`;
      await AsyncStorage.setItem(chunkKey, JSON.stringify({ nom_drive, nom_driveUrl, dateScraped, chunk: chunks[i] }));
    }
  };

  const getLocalData = async (nom_drive) => {
    try {
      const chunkKeys = await AsyncStorage.getAllKeys();
      const nom_driveChunks = chunkKeys.filter((key) => key.startsWith(`${nom_drive}_`));
      
  
      if (nom_driveChunks.length > 0) {
  
        // Combine and parse chunks
        const chunks = await Promise.all(
          nom_driveChunks.map(async (chunkKey) => {
            const chunkData = await AsyncStorage.getItem(chunkKey);
            return JSON.parse(chunkData).chunk;
          })
        );
  
        // Concatenate the chunks
        const concatenatedData = [].concat.apply([], chunks);
        return concatenatedData;
      }
  
      return null;
    } catch (error) {
      console.error('Error retrieving local data:', error);
      return null;
    }
  };
  
  
  const fetchData = async () => {
    try {
      // Map selected drives to an array of fetch promises
      const fetchDataPromises = selectedDrives.map(async ({ supermarket,nom_drive, nom_driveUrl, dateScraped }) => {
        // Check if data is stored locally
        const localData = await getLocalData(nom_drive);
        if (localData) {
          console.log(`Found local data for ${nom_drive}`);
          return localData;
        }
  
        // Fetch data from the network
        const url = `https://bubu0797.pythonanywhere.com/api/${supermarket}/${nom_driveUrl}/product/`;
        const response = await axios.get(url);
        const responseData = response.data;
  
        // Store the data in chunks
        await chunkAndStoreData(nom_drive, nom_driveUrl, dateScraped, responseData);
  
        return responseData;
      });
  
      // Execute all fetch promises concurrently
      const fetchedData = await Promise.all(fetchDataPromises);
      
      // Once all promises are resolved, update state with fetched data
      setData(fetchedData);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!loading) {
      navigation.navigate("Cherchez vos produits", { data, selectedDrives });
    }
  }, [loading]);
  

  return (
    
      <SafeAreaView style={styles.container}>
        <View >
          <Text style={styles.infoText}>Drives Choisis: </Text>
        </View>
        {selectedDrives.map(({ nom_drive }, index) => (
          <Text style={styles.infoText} key={index}>
            - {nom_drive}
          </Text>
        ))}

        {loading ? (
          <View style={styles.indicator}>
            <ActivityIndicator/>
            <View style={styles.text}>
              <Text style={styles.infoText}>Téléchargement des données.</Text>
              <Text style={styles.infoText}>L'opération prend environ 1 minute.</Text>
              <Text style={styles.infoText}>Veuilez ne pas quitter l'application durant cette opération.</Text>
              <Text style={styles.infoText}>Si à la fin du chargement aucun produit est trouvé lors de vos recherches, quittez l'application puis réouvrez.</Text>
            </View>
          </View>
        ) : (
          <>

          </>
        )}

      
      </SafeAreaView>
    
  );
};
 const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'flex-start',
    height: '100%',
    backgroundColor: "#fff",
  },
  indicator: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  text: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '700',
    
  },
  ad: {
    flex:1,
    flexDirection: 'column',
    height: '0%',
  },
  
});
 export default SearchProducts;