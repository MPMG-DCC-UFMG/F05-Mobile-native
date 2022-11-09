import { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Box, Center, Progress, Text } from "native-base";

import colors from "../config/colors";
import useLocation from "../hooks/useLocation";
import AppText from "./AppText";
import getDistanceFromLatLonInKm from "../utility/distance";
import { SessionContext } from "../context/SessionContext";

interface CardProps {
  inspection: any;
  publicWork: any;
  onPress: any;
  // thumbnailUrl: string;
}

export default function InspectionCard({
  inspection,
  publicWork,
  onPress,
}: CardProps) {
  const { latitude, longitude } = useLocation();
  const { workStatus } = useContext(SessionContext);

  console.log(workStatus);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card]}>
        <View style={styles.headerContainer}>
          <AppText style={styles.title}>{inspection.name}</AppText>
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
            )}{" "}
            km
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
        {/* <View style={styles.propContainer}>
          <MaterialCommunityIcons
            name={"list-status"}
            size={12}
            color={colors.primary}
          ></MaterialCommunityIcons>
          <AppText style={styles.subTitle}>{"Pendente"}</AppText>
        </View> */}
        {inspection.status !== 0 ? (
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
        )}

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
        <Center w="100%" pb={4}>
          <Text color={colors.trenaGreen}>Em andamento</Text>
          <Box w="100%">
            <Progress
              bg="coolGray.100"
              _filledTrack={{
                bg: "lime.500",
              }}
              value={75}
              mx="4"
            />
          </Box>
        </Center>
        {/* <View style={{ flex: 1 }}>
          <ProgressSteps
            // activeStepNumColor="transparent"
            // completedStepNumColor="transparent"
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
