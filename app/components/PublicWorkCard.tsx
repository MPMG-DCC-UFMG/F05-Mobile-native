import { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

import colors from "../config/colors";
import useLocation from "../hooks/useLocation";
import AppText from "./AppText";
import getDistanceFromLatLonInKm from "../utility/distance";
import { SessionContext } from "../context/SessionContext";
import { Box, Center, Progress, Text } from "native-base";

export default function PublicWorkCard({ publicWork, onPress }: any) {
  const { latitude, longitude } = useLocation();
  const { workStatus } = useContext(SessionContext);

  const when = dayjs(publicWork.queue_status_date)
    .locale(ptBR)
    .format("DD [de] MMMM [de] YYYY [às] HH:mm[h]");

  const publicWorkStatus = workStatus.find(
    (status) => status.flag === publicWork.user_status
  );

  function getProgress() {
    const step = 100 / workStatus.length;
    const progress = workStatus.indexOf(publicWorkStatus);
    if (progress === -1) return 0;
    return (progress + 1) * step;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card]}>
        <View style={styles.headerContainer}>
          <AppText style={styles.title}>{publicWork.name}</AppText>
        </View>
        <View style={styles.propContainer}>
          <MaterialIcons
            name={"commute"}
            size={12}
            color={colors.primary}
          ></MaterialIcons>
          <AppText style={styles.subTitle}>
            {getDistanceFromLatLonInKm(
              latitude,
              longitude,
              publicWork.address.latitude,
              publicWork.address.longitude
            ).toFixed(2)}
            {" km"}
          </AppText>
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
        <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"update"}
            size={12}
            color={colors.primary}
          ></MaterialCommunityIcons>
          <AppText style={styles.subTitle}>{when}</AppText>
        </View>
        <Center w="100%" pb={4}>
          <AppText style={styles.subTitle}>
            {publicWorkStatus ? publicWorkStatus.name : "Não informado"}
          </AppText>
          <Box w="100%">
            <Progress
              bg="coolGray.100"
              _filledTrack={{
                bg: "lime.500",
              }}
              value={getProgress()}
              mx="4"
            />
          </Box>
        </Center>
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
  propContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
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
    color: colors.gray[100],
    fontSize: 12,
    fontWeight: "bold",
    paddingLeft: 8,
  },
  title: {
    marginBottom: 8,
    color: colors.trenaGreen,
  },
  pendingStatusText: {
    color: colors.gray[100],
    fontSize: 14,
    fontWeight: "bold",
  },
  pendingStatusCard: {
    width: 100,
    borderRadius: 8,
    backgroundColor: colors.red[500],
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 4,
    paddingLeft: 8,
  },
  sendStatusCard: {
    width: 100,
    borderRadius: 8,
    backgroundColor: colors.green[500],
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 4,
    paddingLeft: 8,
  },
});
