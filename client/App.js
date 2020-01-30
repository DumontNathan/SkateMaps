import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import Firebase, { FirebaseProvider } from './config/Firebase'

export default class App extends Component {
  render() {
    return (
      <FirebaseProvider value={Firebase}>
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
