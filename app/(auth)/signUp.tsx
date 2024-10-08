import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useContext, useTransition } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import AuthContext from "@/context/auth/authContext";

interface FormState {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const SignUp: React.FC = () => {
  const { signup } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>("");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

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

    if (!form.name) {
      Alert.alert("Error!", "Please enter your name");
      return false;
    }
    if (!form.email) {
      Alert.alert("Error!", "Please enter your email");
      return false;
    }
    if (!form.password) {
      Alert.alert("Error!", "Please enter your password");
      return false;
    }
    if (!form.phoneNumber) {
      Alert.alert("Error!", "Please enter your phone number");
      return false;
    }
    return isEmailValid && isPasswordValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setModalVisible(true); // Show modal with spinner

    startTransition(() => {
      signup(form.name, form.email, form.password, form.phoneNumber)
        .then((message) => {
          Alert.alert("Message", message, [
            {
              text: "OK",
              onPress: () => {
                if (message === "SignUp successful") {
                  router.push("/signIn");
                }
              },
            },
          ]);
        })
        .catch((error) => {
          Alert.alert("SignUp Error", error.toString());
          console.log(error);
        })
        .finally(() => {
          setModalVisible(false);
        });
    });
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
              validateEmail(e);
            }}
            keyboardType="email-address"
            textInputStyles={[styles.formField, styles.marginTopSmall]}
          />
          {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <FormField
            title="Password"
            value={form.password}
            keyboardType="default"
            placeholder="Enter your password"
            handleChange={(e) => {
              setForm({ ...form, password: e });
              validatePassword(e);
            }}
            textInputStyles={[styles.formField, styles.marginTopSmall]}
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
            title={isPending ? "Signing Up..." : "Signup"}
            containerStyles={styles.buttonContainer}
            onPress={handleSubmit}
            textStyles={styles.buttonText}
            isLoading={isPending} // Use loading from context
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Link href="/signIn" style={styles.signInLink}>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#FF8E01" />
            <Text style={styles.modalText}>Logging in...</Text>
          </View>
        </View>
      </Modal>
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
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    marginTop: 8,
  },
  passwordErrorsContainer: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 200,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
});

export default SignUp;
