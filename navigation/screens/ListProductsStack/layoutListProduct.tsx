
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch  } from "react-redux";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator
} from "react-native";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { deleteCart } from "../../../store/CartSlice";
import { listProductBanner, listProductInter } from "../../../component/idAdmob";

const adUnitId = __DEV__ ? TestIds.BANNER : listProductBanner;

const adInterId = __DEV__ ? TestIds.INTERSTITIAL : listProductInter;

const interstitial = InterstitialAd.createForAdRequest(adInterId , {
  requestNonPersonalizedAdsOnly: true
});

const PricePerSupermarket = () => {

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

  const supermarketImages = {
    Carrefour: "https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Logo_Carrefour.svg/1200px-Logo_Carrefour.svg.png",
    Auchan: "https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png",
    Leclerc: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png",
    Casino: "https://evoclip.fr/753-large_default/adhesif-logo-grande-distribution-gms-casino-supermarches-rouge-et-vert-fond-blanc.jpg",
    Intermarche:"https://play-lh.googleusercontent.com/y8py7OoxNFqBibg-CZrmIACpVLocBOa7yy3U4F3S8G6Fqjljb7g8w-y4WhaGKtAbKzk"
  };
  
  const cart = useSelector((state) => state.cart.cart);
  const navigation = useNavigation();
  const dispatch = useDispatch();

 

  // Group the items in the cart by the supermarket they belong to
  const groupedItems = cart.reduce(
  (acc, item) => {
    if (!acc[item.supermarket]) {
      acc[item.supermarket] = {
        items: [],
        totalPrice: 0,
        pricePerQuantitySum: 0, // Add new property to store sum of price_per_quantity
      };
    }
    acc[item.supermarket].items.push(item);
    acc[item.supermarket].totalPrice += item.prix_produit * item.quantity;
    acc[item.supermarket].pricePerQuantitySum += item.prix_ratio * 1; // Add price_per_quantity to sum
    return acc;
  },
  {}
);

  // Convert the grouped items into an array of objects
  const cartData = Object.entries(groupedItems).map(
    ([supermarket, { items, totalPrice, pricePerQuantitySum }]) => ({
      supermarket,
      items,
      totalPrice: Number(totalPrice.toFixed(2)),
      meanPricePerQuantity: Number((pricePerQuantitySum / (items.length)).toFixed(2)), // Calculate mean price per quantity
      
    })
  );
  

  // Sort the cart by the total price in ascending order
  cartData.sort((a, b) => a.totalPrice - b.totalPrice);

  const handleDeleteCart = (supermarket) => {
    // You can implement the delete cart functionality here
    dispatch(deleteCart(supermarket));
    console.log(`Deleting cart for ${supermarket}`);
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {//interstitialLoaded ? 
        <FlatList
          data={cartData}
          keyExtractor={(item) => item.supermarket}
          renderItem={({ item }) => (  
            <Pressable
              onPress={() =>{
                //interstitial.show();
                navigation.navigate("Liste de course", {
                  supermarket: item.supermarket,
                  totalPrice: item.totalPrice,
                })
              }
              }
            >
              <View style={[styles.cart, { borderColor: item.color }]}>
                <View style={styles.header}>
                  <Image
                    source={{ uri: supermarketImages[item.supermarket] }}
                    style={styles.supermarketImage}
                  />
                  <Text style={[styles.supermarket, { color: item.color }]}>
                    {item.supermarket}

                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCart(item.supermarket)}
                  >
                    <Text style={styles.deleteButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.meanPricePerQuantity}>
                  Moyenne des prix/u: {item.meanPricePerQuantity} €
                </Text>
                <Text style={styles.totalPrice}>
                  Prix total: {item.totalPrice} €
                </Text>
              </View>
            </Pressable>
          )}
        />
        //loading interstitiql
        /*
        : (
          <View style={styles.text}>
            <ActivityIndicator/>
            <Text>Chargement</Text>
          </View>
        ) 
        */
        
      }

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
  cart: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  supermarket: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalPrice: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor:'#FCC908',
    borderRadius:7,
    marginHorizontal:5,
    paddingHorizontal:10,
    paddingVertical:5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width:100,
  },
  deleteButtonText:{
    fontSize: 16,
    textAlign: 'center',
    color: "#1E262F",
    fontWeight: '700',
  },
  meanPricePerQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777",
  },
  supermarketImage: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
    marginRight: 10,
  },
  text: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  
});

export default PricePerSupermarket;
