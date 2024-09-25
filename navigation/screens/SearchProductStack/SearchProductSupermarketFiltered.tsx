
import React, { useEffect,useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  
} from "react-native";
import { MemoizedItem } from "./MemoizedItem";
import {Picker} from '@react-native-picker/picker';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseDB } from "../../../component/firebaseConfig";
import { useSelector } from "react-redux";
import { searchProductBanner } from "../../../component/idAdmob";

const adUnitId = __DEV__ ? TestIds.BANNER : searchProductBanner;

const SearchProductSupermarketFiltered = ({listRayonsFilter,data,selectedDrives }) => {
  const navigation = useNavigation();
  const listRayonsFilter2 = listRayonsFilter !== undefined ? listRayonsFilter : Array(17).fill(true);
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmSelection, setConfirmSelection] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const allItems = data.flatMap((items) => items);

  const handleSearchQuery = () => {
    setConfirmSelection(true);
    setLoading(true);

    // Simulate a loading indicator for 2 seconds
    setTimeout(() => {
      const filteredData = searchQuery
        ? allItems.filter((item) => {
            const itemDataWithoutAccent = item.nom_produit
              ? item.nom_produit.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ")
              : "";
            const textParts = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ");

            return textParts.every((part) => itemDataWithoutAccent.some((itemPart) => itemPart.startsWith(part)));
          })
        : [];

      setFilteredData(filteredData);
      setLoading(false);

    }, 1); // 1/1000 seconds
   
  };


  const [filteredRayonData, setFilteredRayonData] = useState([]);

  const [listRayonsProduct, setListRayonsProduct] = useState(Array(17).fill(false));


  const rayonIndexMap = {
    "Fruits, légumes": 1,
    "Viandes, poissons": 2,
    "Charcuterie, traiteur": 3,
    "Pain, pâtisserie": 4,
    "Produits laitiers, oeufs, fromages": 5,
    "Bio": 6,
    "Surgelés": 7,
    "Épicerie sucrée": 8,
    "Épicerie salée": 9,
    "Boissons": 10,
    "Produits du monde": 11,
    "Nutrition, végétale": 12,
    "Bébé": 13,
    "Hygiène, beauté": 14,
    "Entretien, nettoyage": 15,
    "Animal": 16
  };

  // rayon of filtered data
  const handleRayonPresent = () => {
    const rayonsPrincipaux = [...new Set(filteredData.map(item => item.rayon_principal))];
    const newListRayonsProduct = Array(17).fill(false); // Create a copy of the current array
    rayonsPrincipaux.forEach(rayon => {
      const index = rayonIndexMap[rayon];
      if (index !== undefined) {
        newListRayonsProduct[index] = true;
      }
    });
    setListRayonsProduct(newListRayonsProduct); // Update the state with the new array
  };

  useEffect(() => {
    handleRayonPresent();
  }, [filteredData]); 

  // filter rayon
  const handleFilterRayon = () => {
    if (listRayonsFilter !== undefined){
      const trueIndices = listRayonsFilter2.map((value, index) => value ? index : -1).filter(index => index !== -1);
      // Map trueIndices to rayons using rayonIndexMap
      const rayonsFiltered = trueIndices.map(index => {
      return Object.keys(rayonIndexMap).find(key => rayonIndexMap[key] === index);
      });

      console.log(rayonsFiltered); // Output the filtered rayons

      const newFilteredRayonData = filteredData.filter(item => rayonsFiltered.includes(item.rayon_principal));
      setFilteredRayonData(newFilteredRayonData);
    } else {
      setFilteredRayonData(filteredData);
    }
  };

  useEffect(() => {

    handleFilterRayon();
  }, [listRayonsFilter2,filteredData]); 


  const [sortOption, setSortOption] = useState({ sortBy: "prix_produit", sortOrder: "asc" });
  
  // Sort the data based on sortOption
  const sortedData = [...filteredRayonData].sort((a, b) => {
    if (sortOption.sortBy === "prix_produit") {
      return sortOption.sortOrder === "asc" ? a.prix_produit - b.prix_produit : b.prix_produit - a.prix_produit;
    } else if (sortOption.sortBy === "prix_ratio") {
      return sortOption.sortOrder === "asc" ? a.prix_ratio - b.prix_ratio : b.prix_ratio - a.prix_ratio;
    }
  });

  // Options for sorting
  const sortOptions = [
    { label: "Prix croissant", value: { sortBy: "prix_produit", sortOrder: "asc" } },
    { label: "Prix décroissant", value: { sortBy: "prix_produit", sortOrder: "desc" } },
    { label: "Prix à l'unité croissant", value: { sortBy: "prix_ratio", sortOrder: "asc" } },
    { label: "Prix à l'unité décroissant", value: { sortBy: "prix_ratio", sortOrder: "desc" } },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={(query) => {
              setSearchQuery(query);
              //handleSearchQuery();
            }}
            value={searchQuery}
            placeholder="Nom produit"
          />

              <TouchableOpacity 
                onPress={handleSearchQuery} style={styles.buttonEntrer} >
                <Text style={styles.infoText} >Entrer</Text>
              </TouchableOpacity>
          
        </View>

        <View style={styles.sortContainer}>
              <Picker
                selectedValue={JSON.stringify(sortOption)} // Convert object to string for comparison
                style={styles.sortButton}
                onValueChange={(itemValue) => setSortOption(JSON.parse(itemValue))} // Convert string back to object
              >
                {sortOptions.map((option, index) => (
                  <Picker.Item style={styles.infoText} key={index} label={option.label} value={JSON.stringify(option.value)} /> // Convert object to string for comparison
                ))}
              </Picker>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate("Filter",{selectedDrives,listRayonsProduct,listRayonsFilter2 } )} style={styles.buttonFiltre} >
                <Text style={styles.infoText} >Filtre</Text>
              </TouchableOpacity>
            </View>
        {confirmSelection === false ? (
          <View style={styles.indicator}>
            <Text style={styles.infoText}>Cherchez vos produit</Text>
          </View>
        ) : loading ? (
          // Render ActivityIndicator while loading is true
          <View style={styles.indicator}>
            <ActivityIndicator />
            <Text style={styles.infoText}>Chargement</Text>
          </View>
        ) : sortedData.length > 0 ? (
          <>

            <FlatList
              data={sortedData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MemoizedItem item={item} />} // Use the MemoizedItem component
              estimatedItemSize={300}
            />
          </>
        ) : (
          <View style={styles.indicator}>
            <Text style={styles.infoText}>Produit pas trouvé </Text>
          </View>
        )}
         <BannerAd style={styles.ad}
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
    height:'92%',
    backgroundColor: "#fff",
  },
  container2: {
    flexDirection: 'column',
    marginTop:10,
    justifyContent: 'flex-start',
    backgroundColor: "#fff",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontWeight: '700',
  },
  buttonEntrer:{
    backgroundColor:'#FCC908',
    borderRadius:7,
    marginHorizontal:10,
    paddingHorizontal:10,
    paddingVertical:5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45
  },
  buttonFiltre:{
    backgroundColor:'#FCC908',
    borderRadius:7,
    marginHorizontal:10,
    paddingHorizontal:10,
    paddingVertical:5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width:60,
  },
  indicator: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: "#1E262F",
    fontWeight: '700',
    
  },
  infoTextDrive: {
    color: "#1E262F",
    fontSize: 16,
    fontWeight: '700',
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    
  },
  sortButton: {
    borderRadius:7,
    backgroundColor: "#FCC908",
    width: 238 
  },
});

export default SearchProductSupermarketFiltered;
