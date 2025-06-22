import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, SafeAreaView, Image, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const SearchSupermarketMap = ({ filteredData }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Calculate the bounding box (region) that contains all markers
    if (mapRef.current && filteredData.length > 0) {
      const coordinates = filteredData.map((item) => ({
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
      }));

      let minLat = coordinates[0].latitude;
      let maxLat = coordinates[0].latitude;
      let minLon = coordinates[0].longitude;
      let maxLon = coordinates[0].longitude;

      coordinates.forEach((coord) => {
        minLat = Math.min(minLat, coord.latitude);
        maxLat = Math.max(maxLat, coord.latitude);
        minLon = Math.min(minLon, coord.longitude);
        maxLon = Math.max(maxLon, coord.longitude);
      });

      const padding = 50; // Adjust this value as needed

      // Set the region to fit all markers with some padding
      mapRef.current.fitToCoordinates(
        [
          { latitude: minLat, longitude: minLon },
          { latitude: maxLat, longitude: maxLon },
        ],
        {
          edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
          animated: true,
        }
      );
    }
  }, [filteredData]);

  const getMarkerIcon = (supermarket) => {
    switch (supermarket) {
      case "Carrefour":
        return require('./Static/CarrefourIcon.png'); // Use the correct path to your Carrefour icon
      case "CarrefourMarket":
        return require('./Static/CarrefourMarketIcon.png'); 
      case "Auchan":
        return require('./Static/AuchanIcon.png'); // Use the correct path to your Auchan icon
      case "Leclerc":
        return require('./Static/LeclercIcon.png'); // Use the correct path to your Leclerc icon
      case "HyperIntermarche":
        return require('./Static/HyperIntermarcheIcon.png'); 
      case "SuperIntermarche":
        return require('./Static/SuperIntermarcheIcon.png'); 
      case "HyperU":
        return require('./Static/HyperUIcon.png');
      case "SuperU":
        return require('./Static/SuperUIcon.png');
      default:
        return require('./Static/defaultIcon.jpg'); // Use a default icon or provide a default path
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 46.227638,
          longitude: 2.213749,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {filteredData.map((item) => (
          
          <Marker
            key={item.id}
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }}
            title={item.nom_drive}
          >
            <View style={styles.markerPin}>
              <View style={styles.markerIconWrapper}>
                <Image
                  source={getMarkerIcon(item.supermarket)}
                  style={styles.markerIconImage}
                />
              </View>
              <View style={styles.markerPinTip} />
            </View>
          </Marker>
        ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#202c38",
    marginRight: 10,
  },
  map: {
    flex: 1,
  },
  markerPin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 4,
    borderWidth: 2,
    borderColor: '#202c38',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIconImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'contain',
  },
  markerPinTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#202c38',
    marginTop: -2,
  },
});


export default SearchSupermarketMap;
