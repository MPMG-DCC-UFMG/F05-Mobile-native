import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

import Card from "../components/Card";
import Screen from "../components/Screen";
import colors from "../config/colors";
import routes from "../navigation/routes";
import collectsApi from "../api/collects";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicatior from "../components/ActivityIndicatior";
import useApi from "../hooks/useApi";
import NewCollectCard from "../components/CollectCard";
export interface Listing {
  id: string;
  title: string;
  price: number;
  image: ImageSourcePropType;
}

export default function PublicWorkCollectsScreen({ navigation, route }: any) {
  const publicWork = route.params;
  const {
    data: collects,
    error,
    loading,
    request: loadCollects,
  } = useApi(collectsApi.getCollects);

  useEffect(() => {
    loadCollects();
  }, []);

  const publicWorkCollects = collects
    .filter((collect: any) => {
      return collect.public_work_id === publicWork.id;
    })
    .sort(function (a, b) {
      return b.date - a.date;
    });

  return (
    <>
      <ActivityIndicatior visible={loading} />
      <Screen style={styles.screen}>
        {error && (
          <>
            <AppText>Couldn't retrieve the collects.</AppText>
            <AppButton title="Retry" onPress={loadCollects}></AppButton>
          </>
        )}
        <FlatList
          style={styles.list}
          data={publicWorkCollects}
          keyExtractor={(collect) => collect.id.toString()}
          renderItem={({ item: collect }) => (
            <NewCollectCard
              collect={collect}
              // imageUrl={publicWork.images[0].url}
              onPress={() =>
                navigation.navigate(routes.COLLECT_EDIT, {
                  publicWork,
                  collect,
                })
              }
              // thumbnailUrl={publicWork.images[0].thumbnailUrl}
            />
          )}
        ></FlatList>
        <AppButton
          color={colors.trenaGreen}
          title="Nova Coleta"
          onPress={() =>
            navigation.navigate(routes.COLLECT_EDIT, { publicWork })
          }
        ></AppButton>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    paddingBottom: 0,
    backgroundColor: colors.dark,
  },
  list: {
    marginTop: "20%",
  },
});
