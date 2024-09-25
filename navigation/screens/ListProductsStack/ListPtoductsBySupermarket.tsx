
import {
    FlatList,
    TextInput,
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    SafeAreaView,
    
  } from "react-native";
  import React from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "../../../store/CartSlice";
  import { useState, useEffect } from "react";
  import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { listProductBanner } from "../../../component/idAdmob";

  
  
  const adUnitId = __DEV__ ? TestIds.BANNER : listProductBanner;
    
  const ListProductsBySupermarket = ({ route }) => {
    const { supermarket } = route.params;
    const { totalPrice } = route.params;
    const dispatch = useDispatch();
  
    // Get the items from the cart that belong to the selected supermarket
    const cart = useSelector((state) => state.cart.cart);
    const [checkedItems, setCheckedItems] = useState({});
    const onToggleCheck = (item) => {
      setCheckedItems({
        ...checkedItems,
        [item.id]: !checkedItems[item.id],
      });
    };
  
    const groupedCart = cart
        .filter((item) => item.supermarket === supermarket)
        .reduce((acc, item) => {
          const rayon_principalIndex = acc.findIndex((group) => group.rayon_principal === item.rayon_principal);
          if (rayon_principalIndex === -1) {
            acc.push({
              rayon_principal: item.rayon_principal,
              products: [item],
            });
          } else {
            acc[rayon_principalIndex].products.push(item);
          }
          return acc;
        }, []);
    
        const renderItem = ({ item }) => {
          const isChecked = checkedItems[item.id];
          const backgroundColor = isChecked ? "#fcedb6" : "#fff";
          return (
            <View style={[styles.item, { backgroundColor }]}>
              <View style={styles.columnLeft}>
                
                  <Pressable style={styles.checkboxContainer} onPress={() => onToggleCheck(item)}>
                      <Text >{isChecked ? "✓" : ""}</Text>
                  </Pressable>
                
                
                <Image source={{ uri: item.lien_image }} style={styles.image} />
              </View>
              
              
              <View style={styles.details}>
                <Text style={styles.name}>{item.nom_produit}</Text>
                <View style={styles.columnInter}>

                  <View style={styles.columnInterLeft}>
                    <Text style={styles.price}>{item.prix_produit} €</Text>
                    <Text style={styles.priceUnit} >{item.prix_ratio}€{item.unite} </Text>
                  </View>
                  
                  <View style={styles.columnInterRight}>
                    <Pressable onPress={() => decreaseQuantity(item)}>
                      <Text style={styles.quantityButton}>-</Text>
                    </Pressable>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <Pressable onPress={() => increaseQuantity(item)}>
                      <Text style={styles.quantityButton}>+</Text>
                  </Pressable>

                  
                  </View>
                </View>
              </View>
              
            </View>
          );
        };
        
    
      
    
      const decreaseQuantity = (item) => {
        if (item.quantity == 1) {
          dispatch(removeFromCart(item));
        } else {
          dispatch(decrementQuantity(item));
        }
      };
    
      const increaseQuantity = (item) => {
        dispatch(incrementQuantity(item));
      };
    
      const renderGroupedItem = ({ item }) => {
        return (
          <View style={styles.groupedItem}>
            <Text style={styles.rayon_principalName}>{item.rayon_principal}</Text>
            <FlatList
              data={item.products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderItem({ item, checkedItems })}
              ListEmptyComponent={<Text style={styles.emptyText}>No products in this rayon_principal</Text>}
            />
          </View>
        );
      };
    
  
    return (
      <View style={styles.container}>
        <Text style ={styles.supermarketText}>{supermarket}</Text>
          {groupedCart.length > 0 ? (
            <FlatList
              data={groupedCart}
              keyExtractor={(item) => item.rayon_principal}
              renderItem={renderGroupedItem}
            />
          ) : (
            <Text style={styles.emptyText}>No products found in this supermarket</Text>
          )}
          {cart.length > 0 && (
            <View style={styles.summary}>
              <View style={styles.row}>
                <Text style={styles.label}>Prix total:</Text>
                <Text style={styles.value}>{totalPrice.toFixed(2)} €</Text>
                </View>
                
              </View>
            )}
            <BannerAd 
              unitId={adUnitId}
              size={BannerAdSize.FULL_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true
              }}
            />
          </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 10,
    },
    columnInter:{
      flexDirection: "row",
      marginTop:10
    },
    columnInterLeft:{
      alignItems: "flex-start",
      
    },
    columnInterRight:{
      marginLeft: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    item: {
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
    image: {
      alignItems: "center",
      width: 100,
      height: 100,
      borderRadius: 7,
      marginRight: 5,
      marginLeft: 5,
    },
    details: {
      flex: 1,
      
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    price: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    priceUnit :{
      fontSize: 18,
      fontWeight: "bold",
      color: "#941919",
      marginBottom: 10,
    },

    quantityButton: {
      backgroundColor: "#FCC908",
      padding: 5,
      borderRadius: 5,
      fontSize: 20,
      marginRight: 10,
      width: 32,
      height: 32,
      textAlign: "center",
      fontWeight: "bold",
    },
    quantity: {
      fontSize: 20,
      fontWeight: "bold",
      marginHorizontal: 10,
    },
    emptyText: {
      fontSize: 18,
      textAlign: "center",
      marginTop: 50,
    },
    summary: {
      backgroundColor: "#fff",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: "#eee",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
    },
    value: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#000",
    },
    rayon_principalName :{
      marginVertical: 25,
      textDecorationLine: 'underline',
      fontSize: 24,
      fontWeight: "bold",
      color: "black",
      textAlign: "center",
      marginBottom: 10,
  
    },
    supermarketText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
      textAlign: "left",
      marginBottom: 10,
    },
    columnLeft:{
      flexDirection: "column",
      alignItems: "center",
      
      
      
    },
    checkboxContainer: {
      alignItems: "center",
      borderColor: "black", // Set the border color to black
      borderWidth: 1, // Set the border width
      paddingHorizontal: 5, // Optional: Add some padding to improve visual appearance
      borderRadius: 5, // Optional: Add border radius for a rounded appearance
      height : 27,
      width: 27,
      marginBottom: 7,
      
    },
  });
  
  export default ListProductsBySupermarket;
  