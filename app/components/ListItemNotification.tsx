import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableHighlight,
  GestureResponderEvent,
  Switch,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon, { IconProps } from "../components/Icon";

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
  switchTheme?: boolean;
}
export default function ListItemNotification({
  title,
  subTitle,
  image,
  IconComponent: IconComponent,
  makeChevronRight = false,
  onPress,
  renderRightActions,
  switchTheme = false
}: ListItemProps) {
  const [isEnabled, setIsEnabled] = useState(switchTheme);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.container}>
            <View style={styles.detailsContainer}>
              <Icon
                name={"message-text-outline"}
                backgroundColor={colors.secondary}
                size={35}
              />
              <AppText style={styles.title} numberOfLines={1}>
                {title}
              </AppText>

              {/* <TouchableOpacity>
                <Icon
                  name={"trash-can-outline"}
                  backgroundColor={colors.danger}
                  size={35}
                />
              </TouchableOpacity> */}
            </View>

            <View style={styles.messageContainer}>

              {image && <Image style={styles.image} source={image}></Image>}
              {subTitle && (
                <AppText style={styles.subTitle} numberOfLines={2}>
                  {subTitle}
                </AppText>
              )}
            </View>
            {makeChevronRight && (
              <MaterialCommunityIcons
                name={"chevron-right"}
                size={24}
                color={colors.medium}
              ></MaterialCommunityIcons>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.gray[800],
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",

    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: colors.trenaGreen
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  messageContainer: {
    paddingTop: 10

  },
  subTitle: {
    color: colors.gray[200],
  },
  title: {
    textTransform: "uppercase",
    fontWeight: "600",
    color: colors.gray[100],
    marginLeft: 15
  },
});
