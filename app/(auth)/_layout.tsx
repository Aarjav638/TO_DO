import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AuthProvider from "@/context/auth/authProvider";
const AuthLayout: React.FC = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>
      <StatusBar style="light" backgroundColor="#161622" />
    </AuthProvider>
  );
};

export default AuthLayout;
