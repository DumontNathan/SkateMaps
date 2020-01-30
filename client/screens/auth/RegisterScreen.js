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
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ErrorMessage from "../../components/ErrorMessage";
import { Formik } from "formik";
import * as Yup from "yup";
import { withFirebaseHOC } from "../../config/Firebase";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label("Name")
    .required()
    .min(2, "Must have at least 2 characters"),
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
  password: Yup.string()
    .label("Password")
    .required()
    .min(4, "Password must have at least 4 characters "),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm Password must match Password")
    .required("Confirm Password is required")
});

class RegisterScreen extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    passwordVisibility: true,
    passwordIcon: "ios-eye",
    passwordConfirmIcon: "ios-eye"
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  handleOnSignup = async (values, actions) => {
    const { name, email, password } = values;
    try {
      const response = await this.props.firebase.signupWithEmail(
        email,
        password
      );
      if (response.user.uid) {
        const { uid } = response.user;
        const userData = { email, name, uid };
        await this.props.firebase.createNewUser(userData);
        this.props.navigation.navigate("Main");
      }
    } catch (error) {
      actions.setFieldError("general", error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  handlePasswordVisibility = () => {
    this.setState(prevState => ({
      passwordIcon:
        prevState.passwordIcon === "ios-eye" ? "ios-eye-off" : "ios-eye",
      passwordVisibility: !prevState.passwordVisibility
    }));
  };

  handlePasswordConfirmVisibility = () => {
    this.setState(prevState => ({
      passwordConfirmIcon:
        prevState.passwordConfirmIcon === "ios-eye" ? "ios-eye-off" : "ios-eye",
      passwordConfirmVisibility: !prevState.passwordConfirmVisibility
    }));
  };

  render() {
    const {
      name,
      email,
      password,
      passwordVisibility,
      passwordConfirmVisibility,
      passwordIcon,
      passwordConfirmIcon
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.skatemaps}>SKATEMAPS</Text>
        <View style={styles.logincontainer}>
          <Formik
            initialValues={{
              email: "",
              name: "",
              password: "",
              passwordConfirm: ""
            }}
            onSubmit={(values, actions) => {
              this.handleOnSignup(values, actions);
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
                    name="name"
                    value={values.name}
                    placeholder="Votre nom..."
                    onChangeText={handleChange("name")}
                    iconName="ios-person"
                    iconColor="#2C384A"
                    onBlur={handleBlur("name")}
                  />
                  <ErrorMessage errorValue={touched.name && errors.name} />
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
                    iconName="ios-lock"
                    iconColor="#2C384A"
                    onBlur={handleBlur("password")}
                    rightIcon={
                      <TouchableOpacity onPress={this.handlePasswordVisibility}>
                        <Ionicons name={passwordIcon} size={28} color="grey" />
                      </TouchableOpacity>
                    }
                  />
                  <ErrorMessage
                    errorValue={touched.password && errors.password}
                  />
                  <FormInput
                    name="passwordConfirm"
                    value={values.passwordConfirm}
                    placeholder="Confirmez..."
                    secureTextEntry={!passwordConfirmVisibility}
                    onChangeText={handleChange("passwordConfirm")}
                    iconName="ios-lock"
                    iconColor="#2C384A"
                    onBlur={handleBlur("passwordConfirm")}
                    rightIcon={
                      <TouchableOpacity
                        onPress={this.handlePasswordConfirmVisibility}
                      >
                        <Ionicons
                          name={passwordConfirmIcon}
                          size={28}
                          color="grey"
                        />
                      </TouchableOpacity>
                    }
                  />
                  <ErrorMessage
                    errorValue={
                      touched.passwordConfirm && errors.passwordConfirm
                    }
                  />
                </View>

                <View style={styles.buttons}>
                  <FormButton
                    buttonType="outline"
                    onPress={handleSubmit}
                    title="S'inscrire"
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
              this.props.navigation.navigate("Login");
            }}
          >
            <Text style={styles.account}>
              Vous avez déjà un compte ? Connectez-vous !
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

RegisterScreen.navigationOptions = {
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
    margin: 10
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
    margin: 15
  }
});

export default withFirebaseHOC(RegisterScreen);
