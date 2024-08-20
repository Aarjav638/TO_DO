import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  containerStyles?: ViewStyle | ViewStyle[];
  textStyles?: TextStyle | TextStyle[];
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  containerStyles,
  textStyles,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        containerStyles,
        isLoading && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading}
    >
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#FF8E01",
    borderRadius: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#161622",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
