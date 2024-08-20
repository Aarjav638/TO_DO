import { View, Text, ScrollView, Image, StyleSheet, Alert } from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import FormField from "@/components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import AuthContext from "@/context/auth/authContext";

interface FormState {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const { login, loading, success, message } = useContext(AuthContext);

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const isValid = emailPattern.test(email);
    setEmailError(isValid ? "" : "Please check your email address.");
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const validateForm = (): boolean => {
    const isEmailValid = validateEmail(form.email);
    const isPasswordValid = validatePassword(form.password);

    if (!form.email) {
      Alert.alert("Error!", "Please enter your email");
      return false;
    }
    if (!form.password) {
      Alert.alert("Error!", "Please enter your password");
      return false;
    }
    return isEmailValid && isPasswordValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await login(form.email, form.password);
      if (!success) {
        Alert.alert("Login Error", message);
        return;
      }
      console.log("Logged in successfully");

      // Alert.alert("Success!", "You have successfully logged in", [
      //   {
      //     text: "OK",
      //     onPress: () => router.push("/home"),
      //   },
      // ]);
    } catch (error) {
      Alert.alert("Login Error", "An error occurred during login.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContainer}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.signInText}>Sign in to continue</Text>

          <FormField
            title="Email"
            value={form.email.toLowerCase()}
            placeholder="Enter your email"
            handleChange={(e) => {
              setForm({ ...form, email: e });
              validateEmail(e); // validate on change
            }}
            keyboardType="email-address"
            textInputStyles={styles.formField}
          />
          {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <FormField
            title="Password"
            value={form.password}
            keyboardType="default"
            placeholder="Enter your password"
            handleChange={(e) => {
              setForm({ ...form, password: e });
              validatePassword(e); // validate on change
            }}
            textInputStyles={[styles.formField, styles.passwordField]}
          />
          {passwordErrors.length > 0 && (
            <View style={styles.passwordErrorsContainer}>
              <Text style={styles.errorText}>
                *Please enter a password that matches the following criteria:
              </Text>
              {passwordErrors.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  - {error}
                </Text>
              ))}
            </View>
          )}

          <CustomButton
            title="Login"
            containerStyles={styles.buttonContainer}
            onPress={handleSubmit}
            textStyles={styles.buttonText}
            isLoading={loading} // Use loading from context
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Link href="/signup" style={styles.signUpLink}>
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622",
    height: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContainer: {
    width: "100%",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  logo: {
    width: 115,
    height: 35,
  },
  welcomeText: {
    fontSize: 30,
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginTop: 24,
  },
  signInText: {
    fontSize: 14,
    color: "#FF9001",
    fontFamily: "Poppins-SemiBold",
    marginTop: 12,
  },
  formField: {
    marginTop: 28,
  },
  passwordField: {
    marginTop: 16,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    marginTop: 8,
  },
  passwordErrorsContainer: {
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 32,
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#CDCDE0",
    fontFamily: "Poppins-SemiBold",
  },
  signUpLink: {
    fontSize: 14,
    color: "#FF8E01",
    fontFamily: "Poppins-SemiBold",
  },
});

export default SignIn;
