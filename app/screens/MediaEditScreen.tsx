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
import AppFormImagePicker from "../components/forms/AppFormImagePicker";
import useLocation from "../hooks/useLocation";
import inspectionCollectsApi from "../api/inspectionCollects";
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";
import StatusPickerItem from "../components/StatusPickerItem";
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
  comments: Yup.string().label("Comentários"),
  // price: Yup.number().required().min(1).max(10000).label("Price"),
  status: Yup.object()
    .required("Tipo é uma campo obrigatório")
    .nullable()
    .label("Tipo"),
  // description: Yup.string().label("Description"),
  images: Yup.array().min(1, "O envio de mídia é obrigatório."),
});

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

export default function MediaEditScreen({ navigation, route }: any) {
  const { user } = useAuth();
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

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Não foi possível salvar a coleta.");
    }

    formikBag.resetForm();
  };

  const getPublicWorkStatusFromFlag = (id: number) => {
    return typeOptions.find((option) => option.flag === id)?.name;
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
          // price: "",
          status: route.params.collect
            ? getPublicWorkStatusFromFlag(
                route.params.collect.public_work_status
              )
            : null,
          // description: "",
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {/* <Button
          title="Tirar Foto"
          onPress={() => navigation.navigate(routes.GET_PHOTO)}
        ></Button> */}
        <AppFormImagePicker name="images"></AppFormImagePicker>
        <AppFormField
          maxLength={255}
          name="comments"
          multiline
          placeholder="Comentarios"
        ></AppFormField>
        {/* <AppFormField
          maxLength={8}
          name="price"
          keyboardType="numeric"
          placeholder="Price"
          width={120}
        ></AppFormField> */}
        <AppFormPicker
          items={typeOptions}
          name="status"
          numberOfColumns={1}
          PickerItemComponent={StatusPickerItem}
          placeholder="Status"
          width="60%"
        ></AppFormPicker>
        {/* <AppFormField
          maxLength={255}
          multiline
          autoCapitalize="none"
          name="description"
          placeholder="Description"
        ></AppFormField> */}
        <SubmitButton title="Confirmar"></SubmitButton>
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
  },
});
