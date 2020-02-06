import React from "react";
import { SafeAreaView, StyleSheet, Dimensions, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import mapStyle from "../components/mapStyle";

const { width, height } = Dimensions.get("window");

const SCREEN_HEIGHT = height - 45;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      }
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);

        var currentPosition = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        };

        this.setState({ region: currentPosition });
      },
      error => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  onMapPress = coordinates => {
    alert(
      "Latitude : " +
        coordinates.latitude +
        " Longitude : " +
        coordinates.longitude
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          toolbarEnabled={true}
          loadingEnabled={true}
          onPress={e => {
            this.onMapPress(e.nativeEvent.coordinate);
          }}
        >
          {/* <View style={styles.tuto}>
            <Text>Click on the map to get coordinates !</Text>
          </View> */}
        </MapView>
      </SafeAreaView>
    );
  }
}

MapScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  tuto : {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }

});
