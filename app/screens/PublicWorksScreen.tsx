import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Text,
  FlatList,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import routes from "../navigation/routes";
import publicWorksApi from "../api/publicWorks";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicatior from "../components/ActivityIndicatior";
import useApi from "../hooks/useApi";
import PublicWorkCard from "../components/PublicWorkCard";
import getDistanceFromLatLonInKm from "../utility/distance";
import useLocation from "../hooks/useLocation";
import { SessionContext } from "../context/SessionContext";
import { TextInput } from "react-native-gesture-handler";
import AppTextInput from "../components/AppTextInput";
export interface Listing {
  id: string;
  title: string;
  price: number;
  image: ImageSourcePropType;
}

export default function PublicWorksScreen({ navigation }: any) {
  const {
    data: publicWorks,
    error,
    loading,
    request: loadPublicWorks,
  } = useApi(publicWorksApi.getPublicWorks);
  const { latitude, longitude } = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [searchName, setSearchName] = useState("");
  const { loadDataFromServer } = useContext(SessionContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadPublicWorks();
  }, []);

  const netInfo = useNetInfo();

  const filteredPublicWorks =
    searchName.length > 2
      ? publicWorks.filter((publicWork) =>
        publicWork.name.toLowerCase().includes(searchName.toLowerCase())
      )
      : publicWorks;

  const sortedPublicWorks = publicWorks.sort(function (a, b) {
    return (
      getDistanceFromLatLonInKm(latitude, longitude, a.latitude, a.longitude) -
      getDistanceFromLatLonInKm(latitude, longitude, b.latitude, b.longitude)
    );
  });



  function handleFilter(filtro: string) {
    switch (filtro) {
      case "AZ":
        filteredPublicWorks.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })

        setModalVisible(!modalVisible);

        break;

      case "ZA":
        filteredPublicWorks.sort(function (a, b) {
          if (b.name < a.name) {
            return -1;
          }
          if (b.name > a.name) {
            return 1;
          }
          return 0;
        })

        setModalVisible(!modalVisible);

        break;

      case "dist":
        filteredPublicWorks.sort(function (a, b) {

          let distA = getDistanceFromLatLonInKm(latitude, longitude, a.address.latitude, a.address.longitude)
          let distB = getDistanceFromLatLonInKm(latitude, longitude, b.address.latitude, b.address.longitude)

          if (distA < distB) {
            return -1;
          }
          if (distA > distB) {
            return 1;
          }
          return 0;
        })

        setModalVisible(!modalVisible);

        break;

      default:
        return
    }
  }

  // .sort(function (a, b) {
  //   return (
  //     a.name - b.name
  //     // getDistanceFromLatLonInKm(latitude, longitude, a.latitude, a.longitude) -
  //     // getDistanceFromLatLonInKm(latitude, longitude, b.latitude, b.longitude)
  //   );
  // });

  // console.log(publicWorks);

  return (
    <>
      <ActivityIndicatior visible={loading} />
      <View style={styles.screen}>
        {error && (
          <>
            <AppText>Não foi possível carregar as obras.</AppText>
            <AppButton
              title="Tentar novamente"
              onPress={loadPublicWorks}
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
          <TouchableOpacity
            onPress={() =>
              setModalVisible(!modalVisible)
            }
          >
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
          data={filteredPublicWorks}
          keyExtractor={(publicWork) => publicWork.id.toString()}
          renderItem={({ item }) => (
            <PublicWorkCard
              publicWork={item}
              onPress={() =>
                navigation.navigate(routes.PUBLIC_WORK_COLLECTS, item)
              }
            />
          )}
          refreshing={refreshing}
          onRefresh={() => {
            loadDataFromServer();
          }}
        ></FlatList>
      </View>
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={() =>
          navigation.navigate(routes.PUBLIC_WORK_ADD)
        }
      >
        <MaterialCommunityIcons
          style={styles.addWorkIcon}
          name={"plus"}
          size={60}
          color={colors.gray[100]}
        ></MaterialCommunityIcons>
      </TouchableOpacity>


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
            onPress={() =>
              handleFilter("AZ")
            }
          />
          <AppButton
            color={colors.trenaGreen}
            title="Ordem alfabética (Z-A)"
            onPress={() =>
              handleFilter("ZA")
            }
          />
          <AppButton
            color={colors.trenaGreen}
            title="Distância da obra"
            onPress={() =>
              handleFilter("dist")
            }
          />

          <AppButton
            style={styles.closeButtonModal}
            color={colors.trenaGreen}
            title="Fechar"
            onPress={() =>
              setModalVisible(!modalVisible)
            }
          />

        </View>

      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    paddingBottom: 0,
    backgroundColor: colors.dark,
    flex: 1,
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
    // marginTop: "20%",
  },
  buttonAdd: {
    borderRadius: 25,
  },
  addWorkIcon: {
    padding: 2,
    backgroundColor: colors.trenaGreen,
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 40,
    fontSize: 50
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
    height: 600
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
    alignSelf: "flex-end"
  }
});
