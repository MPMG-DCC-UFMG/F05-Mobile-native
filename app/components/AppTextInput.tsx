import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native";

import defaultStyles from "../config/styles";
import colors from "../config/colors";

export default function AppTextInput({
  icon,
  width = "100%",
  ...otherProps
}: any) {
  return (
    <View style={[styles.container, { width }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        ></MaterialCommunityIcons>
      )}
      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        style={defaultStyles.text}
        {...otherProps}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 4,
    flexDirection: "row",
    padding: 12,
    marginVertical: 12,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
});
