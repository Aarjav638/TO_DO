import { View, Text, ScrollView, Image, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";

interface FormState {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const SignUp: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    if (!form.email) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!form.password) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    if (!form.name) {
      Alert.alert("Error", "Please enter your name");
      return false;
    }
    if (!form.phoneNumber) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    try {
      if (!validateForm()) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      setIsLoading(true);
      console.log(form);
      Alert.alert("Success", "You have successfully Signed Up. Please Login", [
        {
          text: "OK",
          onPress: () => router.push("/signin"),
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>Welcome New User!</Text>
          <Text style={styles.signUpText}>Sign Up to continue</Text>
          <FormField
            title="Name"
            value={form.name}
            placeholder="Enter your Name"
            handleChange={(e) => {
              setForm({ ...form, name: e });
            }}
            keyboardType="default"
            textInputStyles={styles.formField}
          />
          <FormField
            title="Email"
            value={form.email.toLowerCase()}
            placeholder="Enter your email"
            handleChange={(e) => {
              setForm({ ...form, email: e });
            }}
            keyboardType="email-address"
            textInputStyles={[styles.formField, styles.marginTopSmall]}
          />
          <FormField
            title="Password"
            value={form.password}
            keyboardType="default"
            placeholder="Enter your password"
            handleChange={(e) => {
              setForm({ ...form, password: e });
            }}
            textInputStyles={[styles.formField, styles.marginTopSmall]}
          />
          <FormField
            title="Phone Number"
            value={form.phoneNumber}
            placeholder="Enter your Phone Number"
            handleChange={(e) => {
              setForm({ ...form, phoneNumber: e });
            }}
            keyboardType="phone-pad"
            textInputStyles={[styles.formField, styles.marginTopSmall]}
          />
          <CustomButton
            title="Signup"
            containerStyles={styles.buttonContainer}
            onPress={handleSubmit}
            textStyles={styles.buttonText}
            isLoading={isLoading}
          />
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Link href="/signin" style={styles.signInLink}>
              Sign In
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
    height: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: "#FF9001",
    fontFamily: "Poppins-SemiBold",
    marginTop: 12,
  },
  formField: {
    marginTop: 28,
  },
  marginTopSmall: {
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 32,
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
  },
  signInContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  signInText: {
    fontSize: 14,
    color: "#CDCDE0",
    fontFamily: "Poppins-SemiBold",
  },
  signInLink: {
    fontSize: 14,
    color: "#FF8E01",
    fontFamily: "Poppins-SemiBold",
  },
});

export default SignUp;
