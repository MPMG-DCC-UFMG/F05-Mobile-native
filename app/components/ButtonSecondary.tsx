import React from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function ButtonSecondary({ title, onPress, color = "primary" }: any) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    color: colors.white,
    borderRadius: 4,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.gray[100],
    textTransform: "uppercase",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonSecondary;
