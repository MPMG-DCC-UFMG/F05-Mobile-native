import moment from "moment";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";

interface CardProps {
  title: string;
  subTitle: string;
  // imageUrl: string;
  onPress: any;
  // thumbnailUrl: string;
}

export default function CollectCard({
  title,
  subTitle,
  // imageUrl: imageUrl,
  onPress,
}: // thumbnailUrl,
CardProps) {
  const date = new Date(subTitle);
  console.log();
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        {/* <Image
          style={styles.image}
          preview={{ uri: thumbnailUrl }}
          tint="light"
          uri={imageUrl}
        ></Image> */}
        <View style={styles.detailsContainer}>
          <AppText style={styles.title}>{title}</AppText>
          <View style={styles.propContainer}>
            <MaterialCommunityIcons
              name={"calendar-clock"}
              size={12}
              color={colors.primary}
            ></MaterialCommunityIcons>
            <AppText style={styles.subTitle}>
              {moment(date).format("DD/MM/YYYY hh:mm")}
              {/* {date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear()} */}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    backgroundColor: colors.gray[800],
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.trenaGreen,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  propContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingBottom: 16,
  },
  subTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
    paddingLeft: 8,
  },
  title: {
    color: colors.trenaGreen,
    marginBottom: 8,
  },
});
