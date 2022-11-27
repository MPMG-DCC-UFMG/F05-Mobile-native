import { Platform } from "react-native";
import colors from "./colors";

export default {
  colors: colors,
  text: {
    color: colors.gray[100],
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
};
