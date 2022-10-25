import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import useLocation from "../hooks/useLocation";
import AppText from "./AppText";
import ListItemSeparator from "./ListItemSeparator";

interface CardProps {
  inspection: any;
  publicWork: any;
  onPress: any;
  // thumbnailUrl: string;
}

export default function InspectionCard({
  inspection,
  publicWork,
  // imageUrl: imageUrl,
  onPress,
}: // thumbnailUrl,
CardProps) {
  const { latitude, longitude } = useLocation();

  function getDistanceFromLatLonInKm(
    currLat: number,
    currLong: number,
    goalLat: number,
    goalLong: number
  ) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(goalLat - currLat); // deg2rad below
    var dLon = deg2rad(goalLong - currLong);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(currLat)) *
        Math.cos(deg2rad(goalLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d.toFixed(2);
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.card,
          inspection.status === 1
            ? { borderTopColor: "#8BC34A" }
            : { borderTopColor: "#FFC107" },
        ]}
      >
        <View style={styles.headerContainer}>
          <AppText style={styles.title}>{inspection.name}</AppText>
          <AppText style={styles.subTitle}>
            {getDistanceFromLatLonInKm(
              latitude,
              longitude,
              publicWork.address.latitude,
              publicWork.address.longitude
            )}{" "}
            km
          </AppText>
        </View>
        <ListItemSeparator />
        <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"map-marker-distance"}
            size={12}
            color={colors.medium}
          ></MaterialCommunityIcons>
          <AppText style={styles.subTitle}>
            {getDistanceFromLatLonInKm(
              latitude,
              longitude,
              publicWork.address.latitude,
              publicWork.address.longitude
            )}{" "}
            km
          </AppText>
        </View>
        <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"list-status"}
            size={12}
            color={colors.medium}
          ></MaterialCommunityIcons>
          <AppText style={styles.subTitle}>{"Pendente"}</AppText>
        </View>
        <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"map-marker"}
            size={12}
            color={colors.primary}
          ></MaterialCommunityIcons>
          <AppText
            style={styles.subTitle}
          >{`${publicWork.address.street} - ${publicWork.address.number} - ${publicWork.address.city}/${publicWork.address.state}`}</AppText>
        </View>
        {/* <View style={styles.detailsContainer}>
          <View style={styles.typeCard}>
            <AppText style={styles.typeText} color="#fff">
              {"Pavimentacao"}
            </AppText>
          </View>
          <View style={styles.addressContainer}>
            <AppText
              style={styles.subTitle}
            >{`${publicWork.address.street} - ${publicWork.address.number}`}</AppText>
            <AppText
              style={styles.subTitle}
            >{`${publicWork.address.city}/${publicWork.address.state}`}</AppText>
          </View>
        </View> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: colors.medium,
    marginBottom: 20,
    overflow: "hidden",
  },
  propContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingBottom: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 0,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
  },
  addressContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    // padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
  },
  subTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
    paddingLeft: 8,
  },
  title: {
    marginBottom: 8,
    color: colors.white,
  },
  typeText: {
    color: colors.white,
    fontSize: 16,
    // fontWeight: "bold",
  },
  typeCard: {
    width: 100,
    borderRadius: 8,
    backgroundColor: "#81D4FA",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 8,
  },
});
