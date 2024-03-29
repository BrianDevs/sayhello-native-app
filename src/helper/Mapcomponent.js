import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import imagePath from './../constants/imagePath';

const MapComponent = (props) => {
  const renderMarkers = () => {
    return props.data.map((marker, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: parseFloat(marker.lat),
          longitude: parseFloat(marker.long),
        }}
        image={imagePath.pinkloc}
      />
    ));
  };

  return (
    <View style={props.style}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            style={styles.mapStyle}
            showsUserLocation={false}
            zoomEnabled={true}
            zoomControlEnabled={false}
            initialRegion={{
              latitude: parseFloat(props.currentLatitude),
              longitude: parseFloat(props.currentLongitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            customMapStyle={mapStyle}
          >
            {renderMarkers()}
          </MapView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const mapStyle = [];

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MapComponent;
