import React, { useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  Button,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

///screens

import SearchSupermarketMap from "./SearchSupermarketStack/SearchSupermarketMap";

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3515253820147436/9022389604';

const adInterId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3515253820147436/7665624648';

const interstitial = InterstitialAd.createForAdRequest(adInterId , {
  requestNonPersonalizedAdsOnly: true
});

const SearchSupermarket = ({navigation}) => {

  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayList, setDisplayList] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [confirmSelection, setConfirmSelection] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  

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

  const url = "https://bubu0797.pythonanywhere.com/api/supermarket/";

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        setOriginalData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Load selected items from AsyncStorage
    const loadSelectedItems = async () => {
      try {
        const storedSelectedDrives = await AsyncStorage.getItem('selectedDrives');
        if (storedSelectedDrives) {
          const selectedDrives = JSON.parse(storedSelectedDrives);
          
          let i = 0;
          // Check each nom_drive in selectedDrives
          for (const drive of selectedDrives) {
            const nomDriveItem = `${await AsyncStorage.getItem(drive.nom_drive)}_0`;
            
            if (nomDriveItem) {
              // Handle the case when nom_drive item exists
              i = i+1;
              console.log(`Item for nom_drive ${drive.nom_drive} exists:`, nomDriveItem);
            } 
          }
          if (i=selectedDrives.length){
            // Handle the case when nom_drive item exists
            navigation.navigate("Trouvez vos produits", { selectedDrives });
          } 
        }
      } catch (error) {
        console.error('Error loading selected items:', error);
      }
    };
  
    loadSelectedItems();
  }, []);

  const handleSearchQuery = () => {
    const filteredData = searchQuery
      ? originalData.filter((item) => {
          const itemDataWithoutAccent = item.city
            ? item.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ')
            : [];
          const textParts = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');

          return textParts.every((part) =>
            itemDataWithoutAccent.some((itemPart) => itemPart.startsWith(part))
          );
        })
      : [];
    
    setFilteredData(filteredData);
    setConfirmSelection(true)
  };

  const toggleDisplay = () => {
    setDisplayList(!displayList);
  };

  //Function to Display List Supermarket
  

  const handleItemSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  const handleConfirmSelection = async () => {
    await AsyncStorage.clear();
    const selectedDrives = selectedItems.map((item) => ({
      supermarket: item.supermarket,
      nom_drive: item.nom_drive,
      nom_driveUrl: item.nom_driveUrl,
      dateScraped: item.dateScraped,
    }));
    await AsyncStorage.setItem('selectedDrives', JSON.stringify(selectedDrives));
    
    navigation.navigate("Trouvez vos produits", { selectedDrives });
  };
  
  const resetSelection = () => {
    setSelectedItems([]);
  };

  const renderItem = ({ item }) => {
    let imageUri;
    if (item.supermarket === "Carrefour") {
      imageUri =
        "https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Logo_Carrefour.svg/1200px-Logo_Carrefour.svg.png";
    } else if (item.supermarket === "Auchan") {
      imageUri =
        "https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png";
    } else if (item.supermarket === "Leclerc") {
      imageUri =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png";
    } else if (item.supermarket === "Casino") {
      imageUri =
        "https://evoclip.fr/753-large_default/adhesif-logo-grande-distribution-gms-casino-supermarches-rouge-et-vert-fond-blanc.jpg";
    } else if (item.supermarket === "Intermarche") {
      imageUri =
        "https://play-lh.googleusercontent.com/y8py7OoxNFqBibg-CZrmIACpVLocBOa7yy3U4F3S8G6Fqjljb7g8w-y4WhaGKtAbKzk";
    }
    return (
      <Pressable
        style={[
          styles.itemContainer,
          selectedItems.includes(item) && styles.selectedItemContainer,
        ]}
        onPress={() => handleItemSelect(item)}
      >
        <View style={styles.itemContent}>
          <Image source={{ uri: imageUri }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.supermarket}>{item.nom_drive}</Text>

            <View style={styles.columnsLeft}>
              <Text style={styles.city}>{item.city}</Text>
              <Text style={styles.supermarket}>{item.supermarket}</Text>
            </View>

            <View style={styles.columnsRight}>
              <Text style={styles.city}>{"Date maj: "}{item.dateScraped}</Text>
            </View>
            
          </View>
        </View>
        {selectedItems.includes(item) && (
          <AntDesign name="checkcircle" size={24} color="green" />
        )}
      </Pressable>
    );
  };

 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>       
        <TextInput
          style={styles.searchInput}
          placeholder="Code postal ou nom de votre ville"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
        />
        <Button title={"Entrer"} onPress={handleSearchQuery} style={styles.searchButton} /> 
      </View>
      <Button title={displayList ? "Map" : "List"} onPress={toggleDisplay} />
      
      {loading ? (
        <View style={styles.text}>
          <ActivityIndicator/>
          <Text>Chargement</Text>
        </View>
      ) : confirmSelection === false ? (
        <View style={styles.text}>
          <Text >Trouvez vos supermarchés</Text>
        </View>
        ) : filteredData.length > 0 ?(
          displayList ? (
            <SafeAreaView style={styles.container}>
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              />

              {selectedItems.length > 0 && (
                <View style={styles.selectionContainer}>
                  <Button title="Reset" onPress={resetSelection} />
                  <Text style={styles.selectionText}>
                    Limite : {selectedItems.length}/2
                  </Text>
                        
                  {interstitialLoaded ? 
                    <Button title="Choisir" onPress=
                    {() =>{ 
                      interstitial.show();
                      handleConfirmSelection(); 
                    }}/>
                    : <ActivityIndicator/>
                  }        
                </View>
              )}
            </SafeAreaView>
          ) : (
            <SearchSupermarketMap filteredData={filteredData} />
          )
          
      ) : (
        <View style={styles.text}>
          <Text >Nous n'avons pas trouvé de supermarché dans cette ville </Text>
        </View>
      )}

      <BannerAd 
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  text: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  searchContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex:1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton:{
    backgroundColor:'#007AFF',
    borderRadius:5,
    marginLeft:10,
    paddingHorizontal:10,
    paddingVertical:5
  },
  searchButtonText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  selectedItemContainer: {
    backgroundColor: "#e6ffe6",
    borderColor: "green",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  itemDetails: {},
  supermarket: {
    fontSize: 18,
    width: 280,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  city: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  columnsRight:{
    width: 200,
  },
  columnsLeft:{
    width: 240,
    
  },
});

export default SearchSupermarket;
