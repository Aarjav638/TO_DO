import {
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  KeyboardTypeOptions,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChange: (text: string) => void;
  textInputStyles?: object;
  keyboardType?: KeyboardTypeOptions;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChange,
  textInputStyles,
  keyboardType = "default",
}) => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, textInputStyles]}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={value}
          secureTextEntry={title === "Password" && showPassword}
          onChangeText={handleChange}
          keyboardType={keyboardType}
          placeholder={placeholder}
          maxLength={title === "Phone Number" ? 10 : 100}
          placeholderTextColor="#7b7b8b"
          autoComplete={
            title === "Phone Number"
              ? "tel"
              : title === "Email"
              ? "email"
              : title === "Password"
              ? "password"
              : title === "Name"
              ? "name"
              : "off"
          }
        />

        {title === "Password" && (
          <TouchableWithoutFeedback
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              style={[
                styles.icon,
                { tintColor: showPassword ? "#7b7b8b" : "#FF9C01" },
              ]}
              resizeMode="contain"
              source={showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E2D",
    borderColor: "#232533",
    borderWidth: 2,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  textInput: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    width: "90%",
  },
  icon: {
    position: "absolute",
    right: 16,
    height: 24,
    width: 24,
  },
});

export default FormField;
