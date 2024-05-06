import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const Filter = ({ route }) => {
    const { data, selectedDrives, listRayonsProduct, listRayonsFilter2 } = route.params;
    const navigation = useNavigation();
    const [listRayonsFilter, setListRayonsFilter] = useState([]);

    useEffect(() => {
        setListRayonsFilter(listRayonsFilter2);
    }, []);

    const handleConfirmSelection = () => {
        navigation.navigate("Cherchez vos produits", { data, selectedDrives, listRayonsFilter });
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rayons</Text>
            <View style={styles.row}>
                {categories.map((category, index) => renderCategory(index + 1, category))}
            </View>
            <TouchableOpacity
                onPress={() => handleConfirmSelection()}
                style={styles.buttonEntrer}
            >
                <Text style={styles.infoText}>Voir les produits</Text>
            </TouchableOpacity>
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
        marginHorizontal: 50,
        paddingHorizontal: 50,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        marginTop: 30,
    },
    infoText: {
        fontWeight: '700',
        fontSize: 18,
    },
});

export default Filter;
