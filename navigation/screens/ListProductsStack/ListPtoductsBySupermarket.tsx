
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
    
    const supermarketImages = {
      Carrefour: "https://www.suricats-consulting.com/wp-content/uploads/elementor/thumbs/logo-carrefour-pbeu20f8gik4rblzh5p2qs9ia9j2g813reop4w6dhs.png",
      CarrefourMarket: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8cFCUEs4N-KPeKLmp8WVbpZTzUDQ4Kg2xPg&s",
      Auchan: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsZLFUHjewgStjGBmSbydT84FnhVlxNDShA&s",
      Leclerc: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png",
      HyperIntermarche:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ9vAxXORlaxTvNMkd_ZGtvuSc23S4jQnJjQ&s",
      SuperIntermarche:"https://cdn1.promotons.com/resize?fileName=production/promotons-fr/retailers/9dc1c707-a730-4bb2-b893-a6809372d073/intermarchesuperlogo.png&q=50&f=webp&w=320",
      HyperU:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLDy_YkPY_XT4jV3UYlxP6jGqVqYHqDHjJXQ&s",
      SuperU:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAApVBMVEX///8uSHmwHiQmQ3arAAARN28fPnPZ3eTkwcIqRXcAMGyuDRbIdnhpd5iFkKpYao7LgYKbpLgYOnFyf53IzdcONm/R1d7DyNSPmbBNYIjt7/I8U4CuCROnrsBgcJPm6O24vswALWqVnrSss8RvfZytAAzt1taAi6ZSZItHW4UAGWL19vg5UH69ws/Vm5zFbnHQjpD15+iyJCoAImbaqarAX2K5RknB1CWXAAAGaklEQVR4nO2a6XbiOBBG7QjLsehAMDFrwBBICCHp6f39H21smaVKkheg5/TMnO/+QwhZV2tJxvMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4jTMLBYBCmuz9dj3+E3aKzVSpJgiBJVNLthX+6QhW83BroVDPxhf0mvFOxiPwjQqrx4PjtrEdY6aQVSXnSOWPfyXjzsS9lfVfCPGvNyabjYtQbOgw/tQx0qpn4F/3JWgmrakL1D1+PY3kkftVJd8EpSS3yFNpAJ6JIBLKo5VQKNyo3XEo3sepYhvftG8bekCe2P51+kArpbH453mfoEn/RLQxJUqx7aeo01JbLWZ7h1W7FgiTNJokq+7UvRXql4S4uq5tcFznmNYa6j8alhr6/HBilWIZeuaEfSWPpO9ewtG19Xw0bGT6YHW3V8T3L0L/U8NjSFxoOk4qabS2dUsO7CkM/yJpqU2lYUYtsDKTXGBpdKCT9rMLGhusqQ5GtWh33bN8bln2pkU9XGPIpLqLOqEuaU84aGAbakA9CmfAqx543KjXMm5G3j5RsVu/H0mWGD3QfE3orGASnhH4Tw4FlKBfpKiCf8356ooaK8Jb/nguuVlumrK4wnNHnxguPD7ho3HiUsmmWL689WnLWCvSz9EzeaaclE2P3SdhEPM+QtWyxs5HKRn5jw45pGNJOzNqOGEZTy3BqGrKmD1gQeYWhuNNpfRUcWDY3ZE2VGU7o8phNaFJlY145DYd0+hRT/TJD1lS+nA+zwtMwzA8ZmjxPo/2wxrDHDO0+3JqGD7/LcMgjZhEnarvuzIY0jLjMMDT6cEUyiHrDBTO8YpRO7GAiElnAu7w7FdrIkG0GeRJfelbM0E9OvOnGHJuGLMhTu8sNeeMRxHJzNKTnqkaGYjSbs+Gf5VmVnK+KnYAZxoNwQ39ujOozDReB+cgDcrprZji0DLPQiDecmpxj6McBjx9m1xh609JwS7wXObrnGxrknbCoNHytOJr4CRM82zBVpYXLYvdodD6sNIxn5YZJreGSraQXnIDDpLQXE+tg5DJc1BrmMczFfbiPtK4w9CbdpKR8fbC73nA5vMJQWNcY5xtmu+I2kc5HJPmWXzcPawz3txhspSHXNDpsqroiSFa/wTAbqqOxCqQ1XOXIq19LdQ1Kjn+RSPxiGrEdf31ibu+HBurKWwxiOZsr49JGn6dqdnxpG0aHDpLjzeE+cFV5tmDbsuC1iI1OtAx3VYa9df/AOh/wH1s+XWKvNvIuditmaBvwCLg6ahPzAQvExbzasH2fJz6WGG7i44SQReQwY4r5OrBuZEhSHJE1N4ysb6mS2Bhn/pr98KbdarcezbSD4cg+0/jkYbqufduQSmfnBo+HodHYs+lV9iE9AcuOcebJ49QqQxfO01NcJLE1L7/IYwOwqBwdVMU9kaMZyg3tUUybNV/eUnoy4UcL74vZX07D+33uD+Ij+pP8DQKbUDOjbsXqylZ+nVJv+MTWUuO9hReZBdIzT8yDms/PDQwfP+9zp7QkkSjFAxyVX5DwvVomgl+kSb0lOyYrhx8+jPcWbN5pQ9qH8Qcr6bZVL3jTuj1kr7rm9IWemmHlda1eGJwLLqdT9iR9m2gNCprDiNu+NjL86mxaE1UMj8rr2v2VIwsLXh2G5XfeodFl2pCGANLYEL81MLw55p4sy+t+eGFQ2QrFasTuzp1rafl7i9yQThZtaO9HJxpMxOfPp+yjkog4q/phW6tqhcOGTNvccZdW8WLDNswnNl3AjVt9z2tgSLN3S3ooPvVEz5yJbNXQY/Ld3EVNSl9O5XsBe7mgJzbbXMzjxUvdTGzxd9x9xytgXy5pw/WZolD93Smh6DFaRPTuMCy7ENJ9uKPla0O6gO/vcZliVTc+G4KeNxgrSd9SRzJOOjyOWCX7F/3Zd2qd1enteGuc6KDqjbyJWCrPRiSBm+/ZCS39Tm7fVD6xw+/xkeJimvPlufXctoObdvu59fjF8fh01Z+qvHT9V4xxx/EHgUV/mm2X4rWz0KF8eGJgZ3YQlpKVtxvQ8nQIM3w4MXT9Aeblx/3PX9/aj0faN99+/bz/YfYfYZLmpf9P/04DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPCv4m/OO4QysZ4UwgAAAABJRU5ErkJggg=="

    };

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
            <Text style={styles.rayon_principalName}>
              {item.rayon_principal}
            </Text>
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
        <View style={styles.head}>
          <Image
            source={{ uri: supermarketImages[supermarket] }}
            style={styles.supermarketImage}
          />
          <Text style ={styles.supermarketText}>{//supermarket
          }</Text>
        </View>
        
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
    head : {
      flexDirection: "row",
      alignItems: "center",
      //justifyContent: "center",
    },
    supermarketImage: {
      width: 100, // Adjust the width as needed
      height: 100, // Adjust the height as needed
      marginRight: 10,
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
      backgroundColor: "#FFDB14",
      padding: 5,
      borderRadius: 5,
      fontSize: 20,
      marginRight: 10,
      width: 32,
      height: 32,
      textAlign: "center",
      fontWeight: "bold",
      borderColor: "#1E262F",
      borderWidth: 1,
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
  