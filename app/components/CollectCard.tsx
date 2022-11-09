import { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

import colors from "../config/colors";
import useLocation from "../hooks/useLocation";
import AppText from "./AppText";
import getDistanceFromLatLonInKm from "../utility/distance";
import { SessionContext } from "../context/SessionContext";
import { Box, Center, Progress, Text } from "native-base";

export default function NewCollectCard({ collect, onPress }: any) {
  const { latitude, longitude } = useLocation();
  const { workStatus } = useContext(SessionContext);

  const when = dayjs(collect.date)
    .locale(ptBR)
    .format("DD [de] MMMM [de] YYYY [às] HH:mm[h]");

  const publicWorkStatus = workStatus.find(
    (status) => status.flag === collect.public_work_status
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
          <AppText style={styles.title}>{collect.comments}</AppText>
        </View>
        <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"calendar"}
            size={12}
            color={colors.primary}
          ></MaterialCommunityIcons>
          <AppText style={styles.subTitle}>{when}</AppText>
        </View>
        <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"account"}
            size={12}
            color={colors.primary}
          ></MaterialCommunityIcons>
          <AppText style={styles.subTitle}>{collect.user_email}</AppText>
        </View>
        {/* <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"list-status"}
            size={12}
            color={colors.primary}
          ></MaterialCommunityIcons>
          <AppText style={styles.subTitle}>{"Pendente"}</AppText>
        </View> */}
        {/* {publicWork.user_status !== 0 ? (
          <View style={styles.detailsContainer}>
            <View style={styles.pendingStatusCard}>
              <AppText style={styles.pendingStatusText}>{"Pendente"}</AppText>
            </View>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.sendStatusCard}>
              <AppText style={styles.pendingStatusText}>{"Enviada"}</AppText>
            </View>
          </View>
        )} */}
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
        {/* <View style={{ flex: 1 }}>
          <ProgressSteps
            activeStepNumColor={colors.white}
            completedStepNumColor={colors.white}
          >
            {workStatus.map((status, idx) => {
              return (
                <ProgressStep
                  key={idx}
                  removeBtnRow
                  label={status.flag === 1 ? status.name : ""}
                >
                  <View style={{ alignItems: "center" }}></View>
                </ProgressStep>
              );
            })}
          </ProgressSteps>
        </View> */}
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
