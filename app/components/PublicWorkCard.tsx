import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";

import colors from "../config/colors";
import AppText from "./AppText";

interface CardProps {
  title: string;
  subTitle: string;
  // imageUrl: string;
  onPress: any;
  // thumbnailUrl: string;
}

export default function PublicWorkCard({
  title,
  subTitle,
  // imageUrl: imageUrl,
  onPress,
}: // thumbnailUrl,
CardProps) {
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
          <AppText style={styles.subTitle}>{subTitle}</AppText>
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
    overflow: "hidden",
    borderColor: colors.trenaGreen,
    borderWidth: 1,
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  subTitle: {
    color: colors.gray[200],
    fontWeight: "bold",
  },
  title: {
    marginBottom: 8,
    color: colors.gray[100],
  },
});
