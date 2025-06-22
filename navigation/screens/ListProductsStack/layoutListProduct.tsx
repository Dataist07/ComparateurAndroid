
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
    Carrefour: "https://www.suricats-consulting.com/wp-content/uploads/elementor/thumbs/logo-carrefour-pbeu20f8gik4rblzh5p2qs9ia9j2g813reop4w6dhs.png",
    CarrefourMarket: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8cFCUEs4N-KPeKLmp8WVbpZTzUDQ4Kg2xPg&s",
    Auchan: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsZLFUHjewgStjGBmSbydT84FnhVlxNDShA&s",
    Leclerc: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png",
    HyperIntermarche:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ9vAxXORlaxTvNMkd_ZGtvuSc23S4jQnJjQ&s",
    SuperIntermarche:"https://cdn1.promotons.com/resize?fileName=production/promotons-fr/retailers/9dc1c707-a730-4bb2-b893-a6809372d073/intermarchesuperlogo.png&q=50&f=webp&w=320",
    HyperU:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLDy_YkPY_XT4jV3UYlxP6jGqVqYHqDHjJXQ&s",
    SuperU:"data:image/png;base64,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"

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
      {interstitialLoaded ? 
        <FlatList
          data={cartData}
          keyExtractor={(item) => item.supermarket}
          renderItem={({ item }) => (  
            <Pressable
              onPress={() =>{
                interstitial.show();
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
        
        : (
          <View style={styles.text}>
            <ActivityIndicator/>
            <Text>Chargement</Text>
          </View>
        ) 
        
        
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
    backgroundColor:'#FFDB14',
    borderRadius:7,
    marginHorizontal:5,
    paddingHorizontal:10,
    paddingVertical:5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width:110,
    borderColor: "#1E262F",
    borderWidth: 1,
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
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    marginRight: 10,
  },
  text: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  
});

export default PricePerSupermarket;
