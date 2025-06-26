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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

///screens

import SearchSupermarketMap from "./mapSearchSupermarket";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseDB } from "../../../component/firebaseConfig";
import { replaceCart } from "../../../store/CartSlice";
import { searchSupermarketBanner, searchSupermarketInter } from "../../../component/idAdmob";


const adUnitId = __DEV__ ? TestIds.BANNER : searchSupermarketBanner;

const adInterId = __DEV__ ? TestIds.INTERSTITIAL : searchSupermarketInter;

const interstitial = InterstitialAd.createForAdRequest(adInterId , {
  requestNonPersonalizedAdsOnly: true
});

const SearchSupermarket = () => {
  //interstitial

  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

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

  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayList, setDisplayList] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [confirmSelection, setConfirmSelection] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const url = "https://compar.freeboxos.fr/apininja/supermarkets/";

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

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
  
    const filteredData = query
      ? originalData.filter((item) => {
          const itemDataWithoutAccent = item.city
            ? item.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ')
            : [];
          const textParts = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');

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
    } else if (selectedItems.length < 3) {
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  const handleConfirmSelection = async () => {
    const chunkKeys = await AsyncStorage.getAllKeys();
    const nom_driveChunks = chunkKeys.filter((key) => key.startsWith(`Products_`));

    await Promise.all(nom_driveChunks.map(async (key) => await AsyncStorage.removeItem(key)));

    const selectedDrives = selectedItems.map((item) => ({
      supermarket: item.supermarket,
      department: item.department,
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
        "https://www.suricats-consulting.com/wp-content/uploads/elementor/thumbs/logo-carrefour-pbeu20f8gik4rblzh5p2qs9ia9j2g813reop4w6dhs.png";
    } else if (item.supermarket === "CarrefourMarket") {
      imageUri =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8cFCUEs4N-KPeKLmp8WVbpZTzUDQ4Kg2xPg&s";
    } else if (item.supermarket === "Auchan") {
      imageUri =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsZLFUHjewgStjGBmSbydT84FnhVlxNDShA&s";
    } else if (item.supermarket === "Leclerc") {
      imageUri =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png";
    } else if (item.supermarket === "HyperIntermarche") {
      imageUri =
        "https://play-lh.googleusercontent.com/y8py7OoxNFqBibg-CZrmIACpVLocBOa7yy3U4F3S8G6Fqjljb7g8w-y4WhaGKtAbKzk";
    } else if (item.supermarket === "SuperIntermarche") {
      imageUri =
        "https://play-lh.googleusercontent.com/y8py7OoxNFqBibg-CZrmIACpVLocBOa7yy3U4F3S8G6Fqjljb7g8w-y4WhaGKtAbKzk";
    } else if (item.supermarket === "HyperU") {
      imageUri =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLDy_YkPY_XT4jV3UYlxP6jGqVqYHqDHjJXQ&s";
    } else if (item.supermarket === "SuperU") {
      imageUri =
        "data:image/png;base64,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";
    } else if (item.supermarket === "Lidl") {
      imageUri =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/1024px-Lidl-Logo.svg.png";
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
            <Text style={styles.city}>{item.city}</Text>
            <Text style={styles.city}>{"Date maj: "}{item.dateScraped}</Text>
            
          </View>
        </View>
        {selectedItems.includes(item) && (
          <AntDesign name="checkcircle" size={24} color="green" />
        )}
      </Pressable>
    );
  };

 
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>       
          <TextInput
            style={styles.searchInput}
            placeholder="Code postal ou nom de votre ville"
            onChangeText={(query) => {

              handleSearchQuery(query);

            }}
            value={searchQuery}
          />

        </View>
        <TouchableOpacity 
          onPress={toggleDisplay} style={styles.buttonMap} >
          <Text style={styles.infoText} >{displayList ? "Carte" : "Liste"}</Text>
        </TouchableOpacity>

        
        {loading ? (
          <View style={styles.text}>
            <ActivityIndicator/>
            <Text style={styles.infoText} >Chargement</Text>
          </View>
        ) : confirmSelection === false ? (
          <View style={styles.text}>
            <Text style={styles.infoText} >Trouvez vos supermarchés</Text>
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
                    <TouchableOpacity 
                      onPress={resetSelection} style={styles.buttonFiltre} >
                      <Text style={styles.infoText} >Reset</Text>
                    </TouchableOpacity>

                    <Text style={styles.selectionText}>
                      Limite : {selectedItems.length}/3
                    </Text>
                          
                    {//interstitialLoaded ? 
                      <TouchableOpacity 
                        onPress= {() =>{ 
                          //interstitial.show();
                          handleConfirmSelection(); 
                        }} style={styles.buttonFiltre} >
                        <Text style={styles.infoText} >Choisir</Text>
                      </TouchableOpacity>
                      //: <ActivityIndicator/>
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
  {
        <BannerAd 
          unitId={adUnitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true
          }}
        />
  }
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    borderColor: "#1E262F",
    borderWidth: 1,
  },
  searchInput: {
    flex:1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
 
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
    borderColor: "#1E262F",
    backgroundColor: "#fff",
  },
  selectedItemContainer: {
    backgroundColor: "#fcedb6",
    borderColor: "#1E262F",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  itemImage: {
    width: 65,
    height: 65,
    borderRadius: 30,
    marginRight: 5,
    marginHorizontal:5,
    
  },
  itemDetails: {

  },
  supermarket: {
    fontSize: 22,
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
    borderColor: "#1E262F",
    backgroundColor: "#F5EFE4",
  },
  selectionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    

  },

  buttonFiltre:{
    backgroundColor:'#FFDB14',
    borderRadius:7,
    marginHorizontal:5,
    paddingHorizontal:10,
    paddingVertical:5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width:80,
    borderColor: "#1E262F",
    borderWidth: 1,
  },
  buttonMap:{
    backgroundColor: '#FFDB14',
    borderRadius: 7,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    
    borderColor: "#1E262F",
    borderWidth: 1,
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    color: "#1E262F",
    fontWeight: '700',
    
  },
});

export default SearchSupermarket;
