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
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "../../../store/CartSlice";

const MemoizedItem = React.memo(({ item }) => {
    const carrefourImage = 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Logo_Carrefour.svg/1200px-Logo_Carrefour.svg.png';
    const auchanImage = 'https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png';
    const leclercImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png';
    const casinoImage = 'https://evoclip.fr/753-large_default/adhesif-logo-grande-distribution-gms-casino-supermarches-rouge-et-vert-fond-blanc.jpg';
    const intermarcheImage ='https://play-lh.googleusercontent.com/y8py7OoxNFqBibg-CZrmIACpVLocBOa7yy3U4F3S8G6Fqjljb7g8w-y4WhaGKtAbKzk'

    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
  
    const addItemToCart = (item) => {
      dispatch(addToCart(item));
    };
  
    const removeItemFromCart = (item) => {
      dispatch(removeFromCart(item));
    };
  
    let imageUrl;
    if (item.supermarket === 'Carrefour') {
      imageUrl = carrefourImage;
    } else if (item.supermarket === 'Auchan') {
      imageUrl = auchanImage;
    } else if (item.supermarket === 'Leclerc') {
      imageUrl = leclercImage;
    } else if (item.supermarket === 'Casino') {
      imageUrl = casinoImage;
    } else if (item.supermarket === 'Intermarche') {
      imageUrl = intermarcheImage;
    } else {
      imageUrl = 'https://cdn-icons-png.flaticon.com/512/20/20773.png';
    }
  
    return (
      <View style={styles.item}>
          <View style={styles.columnsLeft}>   
            <Image source={{ uri: imageUrl }} style={styles.imageSupermarket} /> 
            <Image source={{ uri: item.lien_image }} style={styles.image} /> 
          </View>    
           
          <View style={styles.columnMiddle}>
              
              <Text style={styles.name}>{item.nom_produit}</Text>   
          </View>
          
          <View style={styles.columnRight}>
          
              <Text style={styles.price}>{item.prix_produit} €</Text>   
              <Text style={styles.pricePerQuantity}>
                {item.prix_ratio}{" "}
                <Text style={styles.quantityUnit}>{item.unite}</Text>
              </Text>
  
              {cart.some((value) => value.id == item.id) ? (
          
              <Button title={"Retirer"} onPress={() => removeItemFromCart(item)} style={{
                borderColor:"gray",
                backgroundColor: "grey",
                borderWidth :1,
                marginVertical: 10,
                padding:5,
                width: 60,       
                }} 
              />          
              ):(
              <Button title={"Ajouter"} onPress={() => addItemToCart(item)} style={{
                borderColor:"gray",
                backgroundColor: "white",
                borderWidth :1,
                marginVertical: 10,
                padding:5,
                width: 60,
                }} 
              />
              
              )} 
          </View>
          
        </View>
    );
  });

  const styles = StyleSheet.create({
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
  
    columnsLeft:{
      width: 80,
      marginLeft: 2,
      alignItems: "flex-start",
      
    },
    columnMiddle: {
      flex: 1,
      marginLeft: 2,
    },
    columnRight:{       
         
      alignItems: "flex-end",
      marginRight: 2,
    },
    imageSupermarket :{
      width: 30,
      height: 30,
      borderRadius: 2,
      marginRight: 5,
      alignItems: "flex-start",
      
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 8,
      
    },
    
    name: {
      fontSize: 16,
      fontWeight: "bold",
    },
    
    pricePerQuantity: {
      fontSize: 14,
      color: "#941919",
    },
    quantityUnit: {
      fontSize: 10,
      color: "#941919",
    },
    price: {
      fontSize: 14,
      marginTop: 5,
    },
  });
  
export {MemoizedItem};