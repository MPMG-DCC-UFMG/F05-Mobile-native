import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import { useToast } from "native-base";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import AppFormImagePicker from "../components/forms/AppFormImagePicker";
import useLocation from "../hooks/useLocation";
import inspectionCollectsApi from "../api/inspectionCollects";
import UploadScreen from "./UploadScreen";
import GetPhotoScreen from "./GetPhotoScreen";
import routes from "../navigation/routes";
import StatusPickerItem from "../components/StatusPickerItem";
import useAuth from "../auth/useAuth";
import AppButton from "../components/AppButton";
import TrenaFormMediaPicker from "../components/forms/TrenaFormMediaPicker";
import colors from "../config/colors";
import { SessionContext } from "../context/SessionContext";
import { useNavigation } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  comments: Yup.string()
    .required("Comentários é um campo obrigatório")
    .min(1)
    .label("Comentários gerais"),
  status: Yup.object()
    .required("Status é um campo obrigatório")
    .nullable()
    .label("Status"),
  images: Yup.array().min(1, "Favor enviar ao menos uma imagem/vídeo."),
});

// const workStatus = [
//   {
//     flag: 1,
//     name: "Não iniciada",
//     description: "Não iniciada",
//   },
//   {
//     flag: 2,
//     name: "Não localizada",
//     description: "Não localizada",
//   },
//   {
//     flag: 3,
//     name: "Paralisado",
//     description: "Paralisado",
//   },
//   {
//     flag: 4,
//     name: "Em execução",
//     description: "Em execução",
//   },
//   {
//     flag: 5,
//     name: "Concluída",
//     description: "Concluída",
//   },
//   {
//     flag: 6,
//     name: "Em funcionamento",
//     description: "Em funcionamento",
//   },
// ];

// const typePhotos = [
//   {
//     flag: 1,
//     name: "Outros",
//     description: "Outros",
//   },
//   {
//     flag: 2,
//     name: "Fachada",
//     description: "Não localizada",
//   },
//   {
//     flag: 3,
//     name: "Serviços externos",
//     description: "Paralisado",
//   },
//   {
//     flag: 4,
//     name: "Ambiente/cômodo",
//     description: "Em execução",
//   },
//   {
//     flag: 5,
//     name: "Danos na construção",
//     description: "Concluída",
//   },
// ];

export default function InspectionCollectEditScreen({ route }: any) {
  const { user } = useAuth();
  const toast = useToast();
  const { navigate } = useNavigation();
  const { workStatus } = useContext(SessionContext);
  const inspection = route.params.inspection;

  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (collect: any, formikBag: any) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await inspectionCollectsApi.addInspectionCollect(
      { ...collect, inspection, location, user },
      (progress: number) => setProgress(progress)
    );

    console.log(result);

    if (!result.ok) {
      setUploadVisible(false);
      return toast.show({
        title: "Não foi possível salvar a coleta.",
        placement: "top",
        bgColor: "red.500",
      });
    }
    toast.show({
      title: "Vistoria enviada com sucesso!",
      // placement: "top",
      bgColor: colors.trenaGreen,
    });
    navigate(routes.INSPECTIONS);

    formikBag.resetForm();
  };

  const getPublicWorkStatusFromFlag = (id: number) => {
    return workStatus.find((option: any) => option.flag === id)?.name;
  };

  return (
    <View style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <AppForm
        initialValues={{
          comments: route.params.collect ? route.params.collect.comments : "",
          status: route.params.collect
            ? getPublicWorkStatusFromFlag(
                route.params.collect.public_work_status
              )
            : null,
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {/* <AppButton
          title="Tirar Foto"
          onPress={() => navigation.navigate(routes.GET_PHOTO)}
        ></AppButton> */}
        <View style={styles.iconPhoto}>
          <TrenaFormMediaPicker name="images"></TrenaFormMediaPicker>
        </View>
        <View>
          <AppFormField
            maxLength={255}
            name="comments"
            multiline
            placeholder="Comentários gerais"
          ></AppFormField>
          <AppFormPicker
            items={workStatus}
            name="status"
            numberOfColumns={1}
            PickerItemComponent={StatusPickerItem}
            placeholder="Status"
            width="60%"
          ></AppFormPicker>
          <SubmitButton
            color={colors.trenaGreen}
            title="Confirmar"
          ></SubmitButton>
        </View>
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    backgroundColor: colors.dark,
    paddingTop: "25%",
  },
  iconPhoto: {
    width: "100%",
    paddingBottom: 12,
  },
});
