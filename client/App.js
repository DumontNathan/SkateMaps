import React, { Component } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import Firebase, { FirebaseProvider } from "./config/Firebase";

export default class App extends Component {
  render() {
    return (
      <FirebaseProvider value={Firebase}>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </FirebaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink"
  }
});
