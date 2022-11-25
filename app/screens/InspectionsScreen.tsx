import React, { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicatior from "../components/ActivityIndicatior";
import useAuth from "../auth/useAuth";
import InspectionCard from "../components/InspectionCard";

import { SessionContext } from "../context/SessionContext";
import AppTextInput from "../components/AppTextInput";
import getDistanceFromLatLonInKm from "../utility/distance";
import useLocation from "../hooks/useLocation";
export interface Inspection {
  flag: number;
  name: string;
  inquiry_number: number;
  description: string;
  public_work_id: string;
  collect_id: string;
  // 0 = PENDENTE 1 = ATUALIZADA 2 = ENVIADA
  status: 0 | 1 | 2;
  user_email: string;
  request_date: number;
}

export default function InspectionsScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { latitude, longitude } = useLocation();
  const [searchName, setSearchName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const {
    publicWorks,
    inspections,
    error,
    loading,
    loadInspections,
    loadDataFromServer,
  } = useContext(SessionContext);

  const getPublicWorkOfInspection = (publicWorkId: string) => {
    const pw = publicWorks.find((publicWork: any) => {
      return publicWork.id === publicWorkId;
    });
    return pw;
  };

  let filteredInspections = inspections.filter((inspection: any) => {
    return inspection.user_email === user.email;
  });

  filteredInspections =
    searchName.length > 2
      ? filteredInspections.filter((inspection) =>
          inspection.name.toLowerCase().includes(searchName.toLowerCase())
        )
      : filteredInspections;

  const sortByDistance = (a, b) => {
    a = getPublicWorkOfInspection(a.public_work_id);
    b = getPublicWorkOfInspection(b.public_work_id);
    let distA = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      a.address.latitude,
      a.address.longitude
    );
    let distB = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      b.address.latitude,
      b.address.longitude
    );

    if (distA < distB) {
      return -1;
    }
    if (distA > distB) {
      return 1;
    }
    return 0;
  };

  filteredInspections.sort(sortByDistance);

  function handleFilter(filtro: string) {
    switch (filtro) {
      case "AZ":
        filteredInspections.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        break;

      case "ZA":
        filteredInspections.sort(function (a, b) {
          if (b.name < a.name) {
            return -1;
          }
          if (b.name > a.name) {
            return 1;
          }
          return 0;
        });

        break;

      case "dist":
        filteredInspections.sort(sortByDistance);

        break;

      default:
        return;
    }
    setModalVisible(!modalVisible);
  }

  return (
    <>
      <ActivityIndicatior visible={loading} />
      <View style={styles.screen}>
        {error && (
          <>
            <AppText>Não foi possível carregar as inspeções.</AppText>
            <AppButton
              title="Tentar Novamente"
              onPress={loadInspections}
            ></AppButton>
          </>
        )}
        <View style={styles.filterContainer}>
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            width="85%"
            icon="magnify"
            name="search"
            placeholder="Busque pelo nome"
            onChangeText={(text) => setSearchName(text)}
            value={searchName}
          />
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <MaterialCommunityIcons
              style={styles.filterIcon}
              name={"filter-variant"}
              size={20}
              color={colors.gray[100]}
            ></MaterialCommunityIcons>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.list}
          data={filteredInspections}
          keyExtractor={(inspection) => inspection.flag.toString()}
          renderItem={({ item: inspection }) => (
            <InspectionCard
              inspection={inspection}
              publicWork={getPublicWorkOfInspection(inspection.public_work_id)}
              onPress={() =>
                navigation.navigate(routes.INSPECTION_COLLECT_EDIT, {
                  inspection,
                })
              }
            />
          )}
          ListEmptyComponent={
            <AppText style={{ color: colors.white }}>
              Não há vistorias solicitadas a esse usuário
            </AppText>
          }
          refreshing={refreshing}
          onRefresh={() => {
            loadDataFromServer();
          }}
        ></FlatList>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <Text style={styles.titleModal}>Selecione os filtros</Text>

          <Text style={styles.subTitleModal}>Ordernar por</Text>

          <AppButton
            color={colors.trenaGreen}
            title="Ordem alfabética (A-Z)"
            onPress={() => handleFilter("AZ")}
          />
          <AppButton
            color={colors.trenaGreen}
            title="Ordem alfabética (Z-A)"
            onPress={() => handleFilter("ZA")}
          />
          <AppButton
            color={colors.trenaGreen}
            title="Distância da vistoria"
            onPress={() => handleFilter("dist")}
          />
          <AppButton
            style={styles.closeButtonModal}
            color={colors.trenaGreen}
            title="Fechar"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: colors.black,
    justifyContent: "center",
  },
  filterContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: "20%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterIcon: {
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    backgroundColor: colors.gray[800],
  },
  list: {
    //marginTop: "20%",
  },
  modal: {
    marginTop: "15%",
    alignSelf: "center",
    padding: 10,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: colors.dark,
    width: "95%",
    height: 600,
  },
  titleModal: {
    textAlign: "center",
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitleModal: {
    marginTop: 10,
    color: colors.white,
    fontSize: 20,
  },
  closeButtonModal: {
    alignSelf: "flex-end",
  },
});
