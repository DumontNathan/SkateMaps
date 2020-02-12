// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { Button } from "react-native-elements";
// import { withFirebaseHOC } from "../config/Firebase";


// class SettingsScreen extends React.Component {

//   handleSignOut = async () => {
//     try {
//       await this.props.firebase.signOut();
//       this.props.navigation.navigate("Auth");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <Button
//           title="Se déconnecter"
//           onPress={() => {
//             this.handleSignOut();
//           }}
//           titleStyle={{ color: "white" }}
//           buttonStyle={{ backgroundColor: "black" }}
//           type="outline"
//         />
//       </View>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });
// export default withFirebaseHOC(SettingsScreen);

// SettingsScreen.navigationOptions = {
//   header: "Settings"
// };
