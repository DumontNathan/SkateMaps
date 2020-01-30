import React, { createContext } from "react";

// Context
const FirebaseContext = createContext({});

// Provider and Consumer
export const FirebaseProvider = FirebaseContext.Provider;
export const FirebaseConsumer = FirebaseContext.Consumer;

// HoC (High Order Component) to generalize this Firebase Context.
// An HoC in React is a function that takes a component and returns another component.
// What this HoC will do is instead of importing and using Firebase.Consumer in every component necessary,
// all there is to be done is just pass the component as the argument to the following HoC.

export const withFirebaseHOC = Component => props => (
  <FirebaseConsumer>
    {state => <Component {...props} firebase={state} />}
  </FirebaseConsumer>
);
