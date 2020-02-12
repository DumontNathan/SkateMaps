import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { withFirebaseHOC } from "../config/Firebase";

class MarkerInfoScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Marker infos</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default withFirebaseHOC(MarkerInfoScreen)
