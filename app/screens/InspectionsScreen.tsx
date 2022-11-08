import React, { useContext, useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet, View } from "react-native";

import colors from "../config/colors";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicatior from "../components/ActivityIndicatior";
import useAuth from "../auth/useAuth";
import InspectionCard from "../components/InspectionCard";

import { SessionContext } from "../context/SessionContext";
export interface Listing {
  id: string;
  title: string;
  price: number;
  image: ImageSourcePropType;
}

export default function InspectionsScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const {
    // typeWorks,
    // typePhotos,
    // workStatus,
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

  const inspectionsUser = inspections.filter((inspection: any) => {
    return inspection.user_email === user.email;
  });

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
        <FlatList
          style={styles.list}
          data={inspectionsUser}
          keyExtractor={(inspection) => inspection.flag.toString()}
          renderItem={({ item: inspection }) => (
            <InspectionCard
              inspection={inspection}
              publicWork={getPublicWorkOfInspection(inspection.public_work_id)}
              // imageUrl={publicWork.images[0].url}
              onPress={() =>
                navigation.navigate(routes.INSPECTION_COLLECT_EDIT, {
                  inspection,
                })
              }
              // thumbnailUrl={publicWork.images[0].thumbnailUrl}
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
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.black,
    justifyContent: "center",
  },
  list: {
    marginTop: "20%",
  },
});
