import React, { useEffect, useState } from "react";
import { Stack, SplashScreen, router, useFocusEffect } from "expo-router";
import { useFonts } from "expo-font";
import AuthProvider from "@/context/auth/authProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RootLayout: React.FC = () => {
  SplashScreen.preventAutoHideAsync();
const[token,setToken]=useState<string>("");
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });
  const fetchToken=async()=>{
    const token =await AsyncStorage.getItem("token") ;
    if(token){
      setToken(token);
      console.log('token:',token)
    }
  }

  useFocusEffect(()=>{
    fetchToken();
  })
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    if (error) {
      console.error("Error loading fonts:", error);
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen name={token?"(tabs)":"index"} />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
