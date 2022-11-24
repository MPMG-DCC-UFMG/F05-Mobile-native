import React, { useContext, useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import useLocation from "../hooks/useLocation";
import collectsApi from "../api/collects";
import UploadScreen from "./UploadScreen";
import StatusPickerItem from "../components/StatusPickerItem";
import useAuth from "../auth/useAuth";
import FormMediaPicker from "../components/forms/FormMediaPicker";
import colors from "../config/colors";
import { SessionContext } from "../context/SessionContext";
import { useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import routes from "../navigation/routes";

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

export default function PublicWorkCollectEditScreen({
  navigation,
  route,
}: any) {
  const { user } = useAuth();
  const toast = useToast();
  const publicWork = route.params.publicWork;
  const { workStatus } = useContext(SessionContext);
  const { navigate } = useNavigation();

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
      title: "Vistoria enviada com sucesso",
      placement: "top",
      bgColor: colors.trenaGreen,
      color: colors.black,
    });
    navigate(routes.PUBLIC_WORK_COLLECTS);

    formikBag.resetForm();
  };

  const getPublicWorkStatusFromFlag = (id: number) => {
    return workStatus.find((option) => option.flag === id)?.name;
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
          <FormMediaPicker name="images"></FormMediaPicker>
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
            placeholder="Status da obra"
            width="100%"
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
    paddingBottom: 0,
    flex: 1,
    backgroundColor: colors.dark,
    paddingTop: "25%",
  },
  iconPhoto: {
    width: "100%",
    paddingBottom: 12,
  },
});
