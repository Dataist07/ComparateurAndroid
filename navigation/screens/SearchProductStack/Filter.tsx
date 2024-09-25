import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity,ActivityIndicator } from "react-native";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { searchProductBanner, searchProductInter } from "../../../component/idAdmob";

const adUnitId = __DEV__ ? TestIds.BANNER : searchProductBanner;
const adInterId = __DEV__ ? TestIds.INTERSTITIAL : searchProductInter;

const interstitial = InterstitialAd.createForAdRequest(adInterId , {
  requestNonPersonalizedAdsOnly: true
});

const Filter = ({ route }) => {
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

    const {selectedDrives, listRayonsProduct, listRayonsFilter2 } = route.params;
    const navigation = useNavigation();
    const [listRayonsFilter, setListRayonsFilter] = useState([]);
    const [allSelected, setAllSelected] = useState(true);

    useEffect(() => {
        setListRayonsFilter(listRayonsFilter2);
    }, []);

    const handleConfirmSelection = () => {
        navigation.navigate("Trouvez vos produits", {selectedDrives, listRayonsFilter });
    };

    const handleToggleRayon = (index) => {
        const newListRayonsFilter = [...listRayonsFilter];
        newListRayonsFilter[index] = !newListRayonsFilter[index];
        setListRayonsFilter(newListRayonsFilter);
    };

    const renderCategory = (index, category) => {
        if (listRayonsProduct[index]) {
            return (
                <TouchableOpacity
                    onPress={() => handleToggleRayon(index)}
                    style={[styles.category, { borderColor: listRayonsFilter[index] ? '#ff0000' : '#000000' }]}
                    key={index}
                >
                    <Text style={[styles.subtitle, { color: listRayonsFilter[index] ? '#ff0000' : '#000000' }]}>{category}</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const categories = [
        "Fruits, légumes",
        "Viandes, poissons",
        "Charcuterie, traiteur",
        "Pain, pâtisserie",
        "Produits laitiers, oeufs, fromages",
        "Bio",
        "Surgelés",
        "Épicerie sucrée",
        "Épicerie salée",
        "Boissons",
        "Produits du monde",
        "Nutrition, végétale",
        "Bébé",
        "Hygiène, beauté",
        "Entretien, nettoyage",
        "Animal"
    ];

    const handleAllSelect = () => {
        const allTrue = listRayonsFilter.map(() => true);
        setListRayonsFilter(allTrue);
        setAllSelected(true);
    };

    const handleAllRemove = () => {
        const allFalse = listRayonsFilter.map(() => false);
        setListRayonsFilter(allFalse);
        setAllSelected(false);
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rayons</Text>
            <View style={styles.row}>
                {categories.map((category, index) => renderCategory(index + 1, category))}
            </View>

            {allSelected ? (
                <TouchableOpacity
                    onPress={() => handleAllRemove()}
                    style={styles.buttonEntrer}
                >
                    <Text style={styles.infoText}>Enlever tous les filtres</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={() => handleAllSelect()}
                    style={styles.buttonEntrer}
                >
                    <Text style={styles.infoText}>Sélectioner tous les filtres</Text>
                </TouchableOpacity>
            )}

            {//interstitialLoaded ?
                <TouchableOpacity
                    onPress={() => {
                        //interstitial.show();
                        handleConfirmSelection();}
                    }
                    style={styles.buttonEntrer}
                >
                    <Text style={styles.infoText}>Voir les produits</Text>
                </TouchableOpacity>
              //: <ActivityIndicator/>
            }    
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
    },
    title: {
        fontWeight: 'bold',
        fontSize: 28,
        marginVertical: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    subtitle: {
        fontWeight: '700',
        fontSize: 16,
    },
    category: {
        margin: 3,
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
        paddingHorizontal: 10,
    },
    buttonEntrer: {
        backgroundColor: '#FCC908',
        borderRadius: 7,
        marginHorizontal: 10,
        paddingHorizontal: 5,
        marginVertical: 20,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
    },
    infoText: {
        fontWeight: '700',
        fontSize: 18,
    },
});

export default Filter;
