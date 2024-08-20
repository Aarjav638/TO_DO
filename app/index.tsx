import { ScrollView, Text, View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import CustomButton from "../components/CustomButton";
import React from "react";

const Index: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContainer}>
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            style={styles.cards}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Stay Organized and On Track with
              <Text style={styles.highlightedText}> TaskMaster </Text>
            </Text>
            <Image
              source={images.path}
              style={styles.pathImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>
            Simplify your life and boost productivity. Manage your tasks
            effortlessly with TaskMaster.
          </Text>
          <CustomButton
            title={"Get Started"}
            onPress={() => {
              console.log("Get Started");
            }}
            containerStyles={styles.buttonContainer}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor={"#161622"} style="light" />
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
    height: "100%",
  },
  mainContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "85%",
    paddingHorizontal: 16,
  },
  logo: {
    width: 130,
    height: 84,
  },
  cards: {
    maxWidth: 380,
    width: "100%",
    height: 300,
  },
  textContainer: {
    position: "relative",
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  highlightedText: {
    color: "#FF8E01",
  },
  pathImage: {
    width: 136,
    height: 15,
    position: "absolute",
    bottom: -8,
    right: -32,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#CDCDE0",
    marginTop: 28,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 28,
  },
});

export default Index;
