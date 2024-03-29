import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, SafeAreaView, Image } from "react-native";
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
      case "Auchan":
        return require('./Static/AuchanIcon.png'); // Use the correct path to your Auchan icon
      case "Casino":
        return require('./Static/CasinoIcon.jpg'); // Use the correct path to your Casino icon
      case "Leclerc":
        return require('./Static/LeclercIcon.png'); // Use the correct path to your Leclerc icon
      case "Intermarche":
        return require('./Static/IntermarcheIcon.png'); // Use the correct path to your Casino icon
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
            <Image
              source={getMarkerIcon(item.supermarket)}
              style={{ width: 40, height: 40 }} // Set your desired width and height
            />
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
    color: "#333",
    marginRight: 10,
  },
  map: {
    flex: 1,
  },
});

export default SearchSupermarketMap;
