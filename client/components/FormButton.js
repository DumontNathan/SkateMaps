import React from "react";
import {StyleSheet} from "react-native"
import { Button } from "react-native-elements";

const FormButton = ({ title, buttonType, buttonColor, ...rest }) => (
  <Button
    {...rest}
    type={buttonType}
    title={title}
    buttonStyle={{ borderColor: buttonColor, borderRadius: 15 }}
    titleStyle={{ color: buttonColor }}
    style={styles.buttonShadow}
  />
);

const styles = StyleSheet.create({
  buttonShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  }
});

export default FormButton;
