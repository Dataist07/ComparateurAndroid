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
    TouchableOpacity
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "../../../store/CartSlice";

const MemoizedItem = React.memo(({ item }) => {
    const carrefourImage = 'https://www.suricats-consulting.com/wp-content/uploads/elementor/thumbs/logo-carrefour-pbeu20f8gik4rblzh5p2qs9ia9j2g813reop4w6dhs.png';
    const carrefourMarketImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8cFCUEs4N-KPeKLmp8WVbpZTzUDQ4Kg2xPg&s';
    const auchanImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsZLFUHjewgStjGBmSbydT84FnhVlxNDShA&s';
    const leclercImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png';
    const hyperIntermarcheImage ='https://play-lh.googleusercontent.com/y8py7OoxNFqBibg-CZrmIACpVLocBOa7yy3U4F3S8G6Fqjljb7g8w-y4WhaGKtAbKzk';
    const superIntermarcheImage ='https://play-lh.googleusercontent.com/y8py7OoxNFqBibg-CZrmIACpVLocBOa7yy3U4F3S8G6Fqjljb7g8w-y4WhaGKtAbKzk';
    const hyperUImage ='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLDy_YkPY_XT4jV3UYlxP6jGqVqYHqDHjJXQ&s';
    const superUImage = 'data:image/png;base64,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';
    const lidlImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/1024px-Lidl-Logo.svg.png'

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
    } else if (item.supermarket === 'CarrefourMarket') {
      imageUrl = carrefourMarketImage;
    } else if (item.supermarket === 'Auchan') {
      imageUrl = auchanImage;
    } else if (item.supermarket === 'Leclerc') {
      imageUrl = leclercImage;
    } else if (item.supermarket === 'HyperIntermarche') {
      imageUrl = hyperIntermarcheImage;
    } else if (item.supermarket === 'SuperIntermarche') {
      imageUrl = superIntermarcheImage;
    } else if (item.supermarket === 'HyperU') {
      imageUrl = hyperUImage;
    } else if (item.supermarket === 'SuperU') {
      imageUrl = superUImage;
    } else if (item.supermarket === 'Lidl') {
      imageUrl = lidlImage;
    } else {
      imageUrl = 'https://cdn-icons-png.flaticon.com/512/20/20773.png';
    }
  
    return (
      <View style={styles.item}>
          <View style={styles.columnsLeft}>   
            <Image source={{ uri: imageUrl }} style={styles.imageSupermarket} /> 
            <Image source={{ uri: item.lien_image }} style={styles.image} /> 
          </View>    
          
          <View style={styles.columnRight}>
              <Text style={styles.name}>{item.nom_produit}</Text>   

              <View style={styles.columnInter}>
                <View style={styles.columnInterLeft}>
                  <Text style={styles.price}>{item.prix_produit} €</Text>   
                  <Text style={styles.pricePerQuantity}>
                    {item.prix_ratio}{" "}
                    <Text style={styles.pricePerQuantity}>{item.unite}</Text>
                  </Text>
                </View>
                <View style={styles.columnInterRight}>
                  {cart.some((value) => value.id == item.id) ? (
                  
                  <TouchableOpacity 
                    onPress={() => removeItemFromCart(item)} style={{         
                      backgroundColor: "grey",
                      marginVertical: 10,
                      marginHorizontal: 10,
                      padding:5,
                      width: 70, 
                      height: 50,  
                      alignItems: 'center',
                      justifyContent: 'center',  
                      borderColor: "#1E262F",
                      borderWidth: 1,
                      }} >
                    <Text style={styles.infoText} >Retirer</Text>
                  </TouchableOpacity>
            
                  ):(
                  <TouchableOpacity 
                    onPress={() => addItemToCart(item)} style={{
                      backgroundColor: "#FFDB14",
                      borderRadius:7,
                      marginVertical: 10,
                      marginHorizontal: 10,
                      padding:5,
                      width: 70, 
                      height: 50,      
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: "#1E262F",
                      borderWidth: 1,
                      }} >
                    <Text style={styles.infoText} >Ajouter</Text>
                  </TouchableOpacity>

                  
                  )} 
                </View>
              </View>
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
      marginHorizontal: 5,
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#1E262F",
      backgroundColor: "#fff",
    },
  
    columnsLeft:{
      width: 80,
      marginLeft: 2,
      marginRight: 40,
      
    },
    columnRight:{       
      flex: 1,
      marginRight: 20,
      
    },
    columnInter:{
      flexDirection: "row",
      marginTop:10,
      justifyContent: "space-between",
    },
    columnInterLeft:{    
    
    },
    columnInterRight:{
    
      marginLeft: 40,
    },
    imageSupermarket :{
      width: 50,
      height: 50,
      borderRadius: 2,
      marginRight: 5,
      alignItems: "flex-start",
      
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 7,
      marginRight: 8,
      
    },
    infoText: {
      fontSize: 16,
      textAlign: 'center',
      color: "#1E262F",
      fontWeight: '700',
    },

    name: {
      fontSize: 18,
      fontWeight: "bold",
      
    },
    
    pricePerQuantity: {
      fontSize: 18,
      color: "#941919",
      fontWeight: '700',
      marginTop: 5,
      fontWeight: '700',
    },
    price: {
      fontSize: 20,
      marginTop: 5,
      //color: "#941919",
    },
  });
  
export {MemoizedItem};