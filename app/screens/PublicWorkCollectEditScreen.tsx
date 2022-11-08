import React, { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import AppFormImagePicker from "../components/forms/AppFormImagePicker";
import useLocation from "../hooks/useLocation";
import collectsApi from "../api/collects";
import UploadScreen from "./UploadScreen";
import GetPhotoScreen from "./GetPhotoScreen";
import routes from "../navigation/routes";
import StatusPickerItem from "../components/StatusPickerItem";
import useAuth from "../auth/useAuth";
import AppButton from "../components/AppButton";
import TrenaFormMediaPicker from "../components/forms/TrenaFormMediaPicker";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  comments: Yup.string()
    .required("Comentários é um campo obrigatório")
    .min(1)
    .label("Comentários gerais"),
  // price: Yup.number().required().min(1).max(10000).label("Price"),
  status: Yup.object()
    .required("Status é um campo obrigatório")
    .nullable()
    .label("Status"),
  // description: Yup.string().label("Description"),
  images: Yup.array().min(1, "Favor enviar ao menos uma imagem/vídeo."),
});

const statusOptions = [
  {
    flag: 1,
    name: "Não iniciada",
    description: "Não iniciada",
  },
  {
    flag: 2,
    name: "Não localizada",
    description: "Não localizada",
  },
  {
    flag: 3,
    name: "Paralisado",
    description: "Paralisado",
  },
  {
    flag: 4,
    name: "Em execução",
    description: "Em execução",
  },
  {
    flag: 5,
    name: "Concluída",
    description: "Concluída",
  },
  {
    flag: 6,
    name: "Em funcionamento",
    description: "Em funcionamento",
  },
];

const typeOptions = [
  {
    flag: 1,
    name: "Outros",
    description: "Outros",
  },
  {
    flag: 2,
    name: "Fachada",
    description: "Não localizada",
  },
  {
    flag: 3,
    name: "Serviços externos",
    description: "Paralisado",
  },
  {
    flag: 4,
    name: "Ambiente/cômodo",
    description: "Em execução",
  },
  {
    flag: 5,
    name: "Danos na construção",
    description: "Concluída",
  },
];

export default function PublicWorkCollectEditScreen({
  navigation,
  route,
}: any) {
  const { user } = useAuth();
  const publicWork = route.params.publicWork;

  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (collect: any, formikBag: any) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await collectsApi.addCollect(
      { ...collect, publicWork, location, user },
      (progress: number) => setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Não foi possível salvar a coleta.");
    }

    formikBag.resetForm();
  };

  const getPublicWorkStatusFromFlag = (id: number) => {
    return statusOptions.find((option) => option.flag === id)?.name;
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
            items={statusOptions}
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
