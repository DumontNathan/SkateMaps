import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { withFirebaseHOC } from "../config/Firebase";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ""
    };
  }

  componentDidMount() {
    this.props.firebase.getUser(this.onUserReceived);
  }

  onUserReceived = user => {
    this.setState({ user: user });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.hello}>Hello, {this.state.user.name}</Text>
          <Text style={styles.email}>Your email is : {this.state.user.email}</Text>
        </ScrollView>
      </View>
    );
  }
}

ProfileScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  hello : {
    fontSize: 40
  },
  email : {
    fontStyle : "italic"
  }
});

export default withFirebaseHOC(ProfileScreen);
