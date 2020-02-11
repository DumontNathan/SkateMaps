import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import mapStyle from "../components/mapStyle";
import FormInput from "../components/FormInput";
import { Button } from "react-native-elements";
import { withFirebaseHOC } from "../config/Firebase";
const { width, height } = Dimensions.get("window");

const SCREEN_HEIGHT = height - 110;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DropdownOptions = ["Street spot", "Skatepark", "DIY spot", "Skateshop"];

class MapScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      addMarker: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      },
      markers: [],
      modalVisible: false,
      newCoordinates: {},
      spotName: "",
      spotDescription: "",
      spotType: "",
      pinColor: ""
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

    this.props.firebase.getAllMarkers(this.onMarkersReceived);
  }

  onMarkersReceived = markers => {
    this.setState({ markers: markers });
  };

  onMapPress = e => {
    if (this.state.addMarker) {
      this.setState({
        newCoordinates: e.nativeEvent.coordinate
      });
      this.setState({ modalVisible: true });
    }
  };

  onDropdownSelect = (idx, value) => {
    var spotType = value;
    this.setState({ spotType: spotType });
    if (spotType == "Street spot") this.setState({ pinColor: "green" });
    else if (spotType == "Skatepark") this.setState({ pinColor: "blue" });
    else if (spotType == "DIY spot") this.setState({ pinColor: "teal" });
    else this.setState({ pinColor: "orange" });
  };

  handleAddMarker = () => {
    if (this.state.addMarker) {
      this.setState({ addMarker: false });
    } else {
      this.setState({ addMarker: true });
      Alert.alert(
        "Créer un marqueur ?",
        "Appuyez quelque part sur la carte pour créer un marqueur."
      );
    }
  };

  handleNameChange = spotName => {
    this.setState({ spotName });
  };

  handleDescriptionChange = spotDescription => {
    this.setState({ spotDescription });
  };

  handleSubmit = () => {
    const markerData = {
      coordinate: this.state.newCoordinates,
      name: this.state.spotName,
      description: this.state.spotDescription,
      type: this.state.spotType,
      pinColor: this.state.pinColor
    };

    this.props.firebase.createNewMarker(markerData).then(
      this.setState({
        modalVisible: false,
        addMarker: false,
        spotDescription: "",
        spotName: "",
        spotType: ""
      }),
      this.props.firebase.getAllMarkers(this.onMarkersReceived)
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: 320,
                height: 440,
                backgroundColor: "white",
                borderWidth: 1,
                borderRadius: 10,
                alignItems: "center"
              }}
            >
              <Button
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}
                buttonType="outline"
                title="X"
                titleStyle={{ color: "white" }}
                buttonStyle={{
                  backgroundColor: "orange",
                  width: 318,
                  borderTopEndRadius: 8,
                  borderTopStartRadius: 8
                }}
              ></Button>
              <Text style={styles.modalTitle}>Créer un marqueur</Text>
              <View style={styles.inputcontainer}>
                <View style={styles.dropdownContainer}>
                  <Text>Sélectionnez un type de marqueur :</Text>
                  <ModalDropdown
                    style={styles.dropdownButton}
                    options={DropdownOptions}
                    onSelect={this.onDropdownSelect}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.dropdownTextStyle}
                    dropdownTextHighlightStyle={{ backgroundColor: "orange" }}
                  />
                </View>
                <FormInput
                  placeholderTextColor="grey"
                  name="Nom"
                  onChangeText={this.handleNameChange}
                  placeholder="Nom du spot..."
                ></FormInput>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Description"
                    onChangeText={this.handleDescriptionChange}
                    placeholderTextColor="grey"
                    numberOfLines={5}
                    multiline={true}
                  />
                </View>
                <Button
                  buttonType="outline"
                  onPress={this.handleSubmit}
                  title="Valider"
                  titleStyle={{ color: "white" }}
                  buttonStyle={{ backgroundColor: "black" }}
                  // disabled={!isValid || isSubmitting}
                  // style={styles.buttonLogin}
                  // loading={isSubmitting}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          toolbarEnabled={true}
          loadingEnabled={true}
          onPress={this.onMapPress}
        >
          {this.state.markers.map(marker => (
            <Marker
              coordinate={marker.coordinate}
              key={JSON.stringify(marker.coordinate)}
              pinColor={marker.pinColor}
            >
              <Callout style={styles.callout}>
                <Text style={styles.name}>{marker.name}</Text>
                <Text>Type : {marker.type}</Text>
                <Text style={styles.description}>{marker.description}</Text>
              </Callout>
            </Marker>
          ))}
          {this.state.addMarker ? (
            <View>
              <Button
                title="Annuler"
                onPress={this.handleAddMarker}
                buttonStyle={{ backgroundColor: "white" }}
                titleStyle={{ color: "black" }}
              ></Button>
            </View>
          ) : (
            <Button
              raised
              title="Ajouter un marqueur"
              onPress={this.handleAddMarker}
              buttonStyle={{ backgroundColor: "black" }}
            ></Button>
          )}
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
  callout: {
    flex: 1,
    alignItems: "center"
  },
  description: {
    margin: 15
  },
  name: {
    fontSize: 30,
    fontWeight: "bold"
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  coordinate: {
    fontSize: 10
  },
  inputcontainer: {
    width: 280,
    margin: 5
  },
  textAreaContainer: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 5,
    margin: 10
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start"
  },
  dropdownButton: {
    backgroundColor: "black",
    height: 35,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  dropdownContainer: {
    alignItems: "center"
  },
  dropdownText: {
    color: "white",
    fontSize: 20
  },
  dropdownStyle: {
    width: 130,
    height: 115,
    alignItems: "center"
  },
  dropdownTextStyle: {
    color: "black",
    fontSize: 20
  }
});

export default withFirebaseHOC(MapScreen);
