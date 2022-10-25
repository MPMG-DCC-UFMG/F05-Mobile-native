import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  TouchableHighlight,
  GestureResponderEvent,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";

interface ListItemProps {
  title: string;
  subTitle?: string;
  image?: ImageSourcePropType;
  IconComponent?: JSX.Element;
  makeChevronRight?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  renderRightActions?: any;
}
export default function ListItem({
  title,
  subTitle,
  image,
  IconComponent: IconComponent,
  makeChevronRight = false,
  onPress,
  renderRightActions,
}: ListItemProps) {
  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              {IconComponent}
              {image && <Image style={styles.image} source={image}></Image>}
              <View style={styles.detailsContainer}>
                <AppText style={styles.title}>{title}</AppText>
                {subTitle && (
                  <AppText style={styles.subTitle}>{subTitle}</AppText>
                )}
              </View>
            </View>
            {makeChevronRight && (
              <MaterialCommunityIcons
                name={"chevron-right"}
                size={16}
                // color={color}
              ></MaterialCommunityIcons>
            )}
          </View>
        </TouchableHighlight>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  container: {
    flexDirection: "row",
    padding: 16,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
});