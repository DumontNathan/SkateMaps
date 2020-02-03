// configuration related to integrate the Firebase SDK and the function it provides for authentication and firestore (database)

import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const Firebase = {
  // auth
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },
  signOut: () => {
    return firebase.auth().signOut();
  },
  checkUserAuth: user => {
    return firebase.auth().onAuthStateChanged(user);
  },
  // firestore
  createNewUser: userData => {
    return firebase
      .firestore()
      .collection("users")
      .doc(`${userData.uid}`)
      .set(userData);
  },

  getUser: (callback) => {
    var userId = firebase.auth().currentUser.uid;
    var docRef = db.collection("users").doc(userId);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          var user = {
            name: doc.data().name,
            email: doc.data().email
          };
          // Callback used in front to get the data (because get() is asynchronous)
          callback(user)
          
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
};
export default Firebase;
