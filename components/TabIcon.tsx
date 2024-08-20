import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from "react-native";
import React from "react";

interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.container}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.icon, { tintColor: color }]}
      />
      <Text
        style={[
          styles.text,
          { color: color },
          focused ? styles.textFocused : styles.textRegular,
        ]}
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    fontSize: 12,
  },
  textFocused: {
    fontFamily: "Poppins-SemiBold",
  },
  textRegular: {
    fontFamily: "Poppins-Regular",
  },
});

export default TabIcon;
