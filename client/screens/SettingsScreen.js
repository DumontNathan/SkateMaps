import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { withFirebaseHOC } from "../config/Firebase";

class SettingsScreen extends Component {
  handleSignOut = async () => {
    console.log("Hoho");
    try {
      await this.props.firebase.signOut();
      this.props.navigation.navigate("Auth");
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Signout"
          onPress={() => {
            this.handleSignout;
          }}
          titleStyle={{
            color: "#F57C00"
          }}
          type="clear"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
export default withFirebaseHOC(SettingsScreen);

SettingsScreen.navigationOptions = {
  header: "none"
};
