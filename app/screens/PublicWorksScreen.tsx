import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

import Card from "../components/Card";
import Screen from "../components/Screen";
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
  const { loadDataFromServer } = useContext(SessionContext);

  useEffect(() => {
    loadPublicWorks();
  }, []);

  const netInfo = useNetInfo();

  const sortedPublicWorks = publicWorks.sort(function (a, b) {
    return (
      getDistanceFromLatLonInKm(latitude, longitude, a.latitude, a.longitude) -
      getDistanceFromLatLonInKm(latitude, longitude, b.latitude, b.longitude)
    );
  });

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
        <FlatList
          style={styles.list}
          data={sortedPublicWorks}
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
  list: {
    marginTop: "20%",
  },
});
