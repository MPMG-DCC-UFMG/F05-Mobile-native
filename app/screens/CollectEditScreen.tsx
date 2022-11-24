import React, { useState } from "react";
import { Alert, Button, StyleSheet } from "react-native";
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
import collectsApi from "../api/collects";
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";
import StatusPickerItem from "../components/StatusPickerItem";
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
  comments: Yup.string().required().min(1).label("Comentários"),
  status: Yup.object().required().nullable().label("Status"),
  images: Yup.array().min(1, "Please select at least one image."),
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

export default function CollectEditScreen({ navigation, route }: any) {
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
      return alert("Could not save the listing");
    }

    formikBag.resetForm();
  };

  const getPublicWorkStatusFromFlag = (id: number) => {
    return statusOptions.find((option) => option.flag === id)?.name;
  };

  return (
    <Screen style={styles.container}>
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
        <AppFormImagePicker name="images"></AppFormImagePicker>
        <AppFormField
          maxLength={255}
          name="comments"
          multiline
          placeholder="Comentarios"
        ></AppFormField>
        <AppFormPicker
          items={statusOptions}
          name="status"
          numberOfColumns={1}
          PickerItemComponent={StatusPickerItem}
          placeholder="Status"
          width="50%"
        ></AppFormPicker>
        <SubmitButton title="Confirmar"></SubmitButton>
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});
