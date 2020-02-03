import React, { Component } from "react";
import { AppLoading } from "expo";
import { withFirebaseHOC } from "../config/Firebase";

// Checks if the user is logged in firebase. If he is, he is redirected to Main, if not, he is redirected to Auth

class Initial extends Component {
  componentDidMount = async () => {
    try {
      await this.props.firebase.checkUserAuth(user => {
        if (user) {
          // if the user has previously logged in
          this.props.navigation.navigate("Main");
        } else {
          // if the user has previously signed out from the app
          this.props.navigation.navigate("Auth");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return <AppLoading />;
  }
}

export default withFirebaseHOC(Initial);
