import {
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChange: (text: string) => void;
  textInputStyles?: string;
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
    <View className="space-y-2">
      <Text className={`text-base text-white font-pmedium ${textInputStyles}`}>
        {title}
      </Text>
      <View
        className={`flex-row items-center bg-black-100 border-black-200 focus:border-secondary border-2 h-14 rounded-2xl px-4`}
      >
        <TextInput
          className="text-white text-base font-psemibold w-[90%]"
          value={value}
          secureTextEntry={title === "Password" && showPassword}
          onChangeText={handleChange}
          keyboardType={keyboardType}
          placeholder={placeholder}
          maxLength={title === "Phone Number" ? 10 : 100}
          placeholderTextColor="#7b7b8b"
          autoComplete={
            title === "Phone Number" ? "tel" : String(title).toLowerCase()
          }
        />

        {title === "Password" && (
          <TouchableWithoutFeedback
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              className="absolute right-4 h-6 w-6"
              resizeMode="contain"
              tintColor={showPassword ? "#7b7b8b" : "#FF9C01"}
              source={showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

export default FormField;
