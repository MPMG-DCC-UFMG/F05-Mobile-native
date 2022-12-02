import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";

import Screen from "../components/Screen";
import colors from "../config/colors";
import routes from "../navigation/routes";
import collectsApi from "../api/collects";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicatior from "../components/ActivityIndicatior";
import useApi from "../hooks/useApi";
import CollectCard from "../components/CollectCard";
import { Collect, SessionContext } from "../context/SessionContext";

export default function PublicWorkCollectsScreen({ navigation, route }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const { loadDataFromServer } = useContext(SessionContext);

  const publicWork = route.params;
  const {
    data: collects,
    error,
    loading,
    request: loadCollects,
  } = useApi(collectsApi.getCollects);

  useFocusEffect(
    useCallback(() => {
      loadCollects();
    }, [])
  );

  const publicWorkCollects: Collect[] = collects
    .filter((collect: Collect) => {
      return (
        collect.public_work_id === publicWork.id && collect.queue_status === 1
      );
    })
    .sort(function (a, b) {
      return b.date - a.date;
    });

  const handleOnCollectPressed = () => {
    Alert.alert(
      "Dados já enviados!",
      "Os dados dessa coleta estão disponíveis apenas aos gestores do MPMG",
      [
        {
          text: "Ok",
          onPress: () => {},
        },
      ],
      { cancelable: true }
    );
  };

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
            <CollectCard collect={collect} onPress={handleOnCollectPressed} />
          )}
          refreshing={refreshing}
          onRefresh={() => {
            loadCollects();
          }}
        ></FlatList>
        <AppButton
          color={colors.trenaGreen}
          title="Nova coleta"
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
    padding: 8,
    paddingBottom: 0,
    backgroundColor: colors.dark,
  },
  list: {
    marginTop: "20%",
  },
});
