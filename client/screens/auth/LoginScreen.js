import React, { Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ErrorMessage from "../../components/ErrorMessage";
import { Formik } from "formik";
import * as Yup from "yup";
import { withFirebaseHOC } from "../../config/Firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
  password: Yup.string()
    .label("Password")
    .required()
    .min(4, "Password must have at least 4 characters ")
});

class LoginScreen extends React.Component {
  state = {
    email: "",
    password: "",
    passwordVisibility: true,
    rightIcon: "ios-eye"
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  handleOnLogin = async (values, actions) => {
    const { email, password } = values
    try {
      const response = await this.props.firebase.loginWithEmail(email, password)
      if (response.user) {
        this.props.navigation.navigate('Main')
      }
    } catch (error) {
      actions.setFieldError('general', error.message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  handlePasswordVisibility = () => {
    this.setState(prevState => ({
      rightIcon: prevState.rightIcon === "ios-eye" ? "ios-eye-off" : "ios-eye",
      passwordVisibility: !prevState.passwordVisibility
    }));
  };

  render() {
    const { email, password, passwordVisibility, rightIcon } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Text style={styles.skatemaps}>SKATEMAPS</Text>
          <View style={styles.logincontainer}>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={(values, actions) => {
                this.handleOnLogin(values, actions);
              }}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                values,
                handleSubmit,
                errors,
                isValid,
                isSubmitting,
                touched,
                handleBlur
              }) => (
                <Fragment>
                  <View style={styles.inputcontainer}>
                    <FormInput
                      name="email"
                      value={values.email}
                      placeholder="Votre email..."
                      autoCapitalize="none"
                      onChangeText={handleChange("email")}
                      iconName="ios-mail"
                      iconColor="#2C384A"
                      onBlur={handleBlur("email")}
                    />
                    <ErrorMessage errorValue={touched.email && errors.email} />
                    <FormInput
                      name="password"
                      value={values.password}
                      placeholder="Votre mot de passe..."
                      secureTextEntry={passwordVisibility}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      iconName="ios-lock"
                      iconColor="#2C384A"
                      onBlur={handleBlur("password")}
                      rightIcon={
                        <TouchableOpacity
                          onPress={this.handlePasswordVisibility}
                        >
                          <Ionicons name={rightIcon} size={28} color="grey" />
                        </TouchableOpacity>
                      }
                    />
                    <ErrorMessage
                      errorValue={touched.password && errors.password}
                    />
                  </View>

                  <View style={styles.buttons}>
                    <FormButton
                      buttonType="outline"
                      onPress={handleSubmit}
                      title="Se connecter"
                      titleStyle={{ color: "white" }}
                      buttonStyle={{ backgroundColor: "black" }}
                      disabled={!isValid || isSubmitting}
                      style={styles.buttonLogin}
                      loading={isSubmitting}
                    />
                  </View>
                  <ErrorMessage errorValue={errors.general} />
                </Fragment>
              )}
            </Formik>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Register");
              }}
            >
              <Text style={styles.account}>
                Pas de compte ? Inscrivez-vous !
              </Text>
            </TouchableOpacity>
            <Text style={styles.divider}>──────── Ou ────────</Text>
            <Button
              title="Se connecter avec Google"
              titleStyle={{ color: "white" }}
              buttonStyle={{ backgroundColor: "black" }}
              style={styles.apiButtons}
            />
            <Button
              title="Se connecter avec Facebook"
              titleStyle={{ color: "white" }}
              buttonStyle={{ backgroundColor: "black" }}
              style={styles.apiButtons}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

LoginScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  textinput: {
    fontSize: 50,
    fontWeight: "bold",
    height: 40,
    width: 325,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10
  },
  logincontainer: {
    borderColor: "black",
    alignItems: "center",
    width: 350
  },
  inputcontainer: {
    width: 325,
    margin: 20
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonLogin: {
    marginBottom: 5,
    width: 250
  },
  apiButtons: {
    margin: 17
  },
  account: {
    margin: 5,
    color: "#F57C00"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  skatemaps: {
    fontSize: 55,
    bottom: 20
  },
  divider: {
    margin: 30
  }
});

export default withFirebaseHOC(LoginScreen);