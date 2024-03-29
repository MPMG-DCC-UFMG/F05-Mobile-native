import React, { useCallback, useContext, useEffect, useState } from "react";
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
// import RNFetchBlob from "rn-fetch-blob"; //  add to "rn-fetch-blob": "^0.12.0",

import colors from "../config/colors";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicatior from "../components/ActivityIndicatior";
import useAuth from "../auth/useAuth";
import InspectionCard from "../components/InspectionCard";
import inspectionsApi from "../api/inspections";

import { Inspection, SessionContext } from "../context/SessionContext";
import AppTextInput from "../components/AppTextInput";
import getDistanceFromLatLonInKm from "../utility/distance";
import useLocation from "../hooks/useLocation";
import ButtonSecondary from "../components/ButtonSecondary";
import { environment } from "../../enviroment";
import useApi from "../hooks/useApi";
import { useFocusEffect } from "@react-navigation/native";

export default function InspectionsScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { latitude, longitude } = useLocation();
  const [searchName, setSearchName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [checkFilter, setCheckFilter] = useState(0);
  const {
    publicWorks,
    inspections,
    error,
    loading,
    loadInspections,
    loadPublicWorks,
    loadDataFromServer,
  } = useContext(SessionContext);

  useFocusEffect(
    useCallback(() => {
      //loadInspections();
      //loadPublicWorks();
    }, [])
  );

  useEffect(() => {
    setCheckFilter(0)
  }, [loading])

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

  const sortByStatusDateAndDistance = (a, b) => {
    if (a.status !== b.status && checkFilter === 0) return a.status - b.status;
    if (a.request_date !== b.request_date && checkFilter === 0) return b.request_date - a.request_date;
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

  filteredInspections.sort(sortByStatusDateAndDistance)

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
        filteredInspections.sort(sortByStatusDateAndDistance);
        setCheckFilter(1)

        break;

      default:
        return;
    }
    setModalVisible(!modalVisible);
  }

  // Does not work in expo (requires run:android / run:ios)
  // const downloadReport = (inspection: Inspection) => {
  //   const { config, fs } = RNFetchBlob;
  //   const { DownloadDir } = fs.dirs; // You can check the available directories in the wiki.
  //   const options = {
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true, // true will use native manager and be shown on notification bar.
  //       notification: true,
  //       path: `${DownloadDir}/relatorio-vistoria-${inspection.inquiry_number}.pdf`,
  //       description: "Downloading.",
  //     },
  //   };
  //   config(options)
  //     .fetch(
  //       "GET",
  //       `${environment.apiUrl}inspections/report/${inspection.flag}/?X-TRENA-KEY=${environment.apiKey}`
  //     )
  //     .then((res) => {
  //       console.log(res);
  //     });
  // };

  const handleInspectionClick = (inspection: Inspection) => {
    if (inspection.status === 0)
      navigation.navigate(routes.INSPECTION_COLLECT_EDIT, {
        inspection,
      });
    else {
      Alert.alert(
        "Vistoria já enviada",
        "Deseja fazer o download do relatório gerado automaticamente?",
        [
          {
            text: "Cancelar",
            onPress: () => {},
          },
          {
            text: "Fazer download",
            onPress: async () => {
              // downloadReport(inspection);
              Alert.alert(
                "Disponível em breve",
                "Relatório enviado atualmente só pode ser acessado pelos gestores do MPMG",
                [
                  {
                    text: "Ok",
                    onPress: () => {},
                  },
                ],
                { cancelable: true }
              );
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  function onKnowMoreButtonPressed() {
    Alert.alert(
      "Vistorias técnicas",
      "Apenas parceiros da equipe do MPMG podem fazer vistorias técnicas das obras.",
      [
        {
          text: "Ok",
          onPress: () => {},
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <>
      <ActivityIndicatior visible={loading} />
      <View style={styles.screen}>
        {error && (
          <>
            <AppText>Não foi possível carregar as vistorias.</AppText>
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
          data={filteredInspections}
          keyExtractor={(inspection) => inspection.flag.toString()}
          renderItem={({ item: inspection }) => (
            <InspectionCard
              inspection={inspection}
              publicWork={getPublicWorkOfInspection(inspection.public_work_id)}
              onPress={() => handleInspectionClick(inspection)}
            />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <AppText style={{ color: colors.gray[100], padding: 12 }}>
                Não há vistorias solicitadas a esse usuário.
              </AppText>
              <ButtonSecondary
                color={colors.gray[800]}
                title="Saiba mais"
                onPress={() => {
                  onKnowMoreButtonPressed();
                }}
              ></ButtonSecondary>
            </View>
          }
          refreshing={refreshing}
          onRefresh={() => {
            loadInspections();
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
    padding: 8,
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
  emptyListContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    marginTop: "15%",
    alignSelf: "center",
    padding: 20,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: colors.dark,
    width: "100%",
    
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
