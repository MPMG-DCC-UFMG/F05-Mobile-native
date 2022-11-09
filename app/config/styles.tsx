import { Platform } from "react-native";
import colors from "./colors";

export default {
  colors: colors,
  text: {
    color: colors.gray[100],

    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
};
