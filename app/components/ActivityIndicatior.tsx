import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

export default function ActivityIndicatior({ visible = false }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <LottieView
        autoPlay
        loop
        source={require("../assets/animations/loader.json")}
      ></LottieView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    height: "100%",
    opacity: 0.8,
    width: "100%",
    backgroundColor: colors.dark,
    zIndex: 1,
  },
});
