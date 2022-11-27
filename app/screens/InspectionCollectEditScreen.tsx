import { useContext, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useToast } from "native-base";

import useLocation from "../hooks/useLocation";
import inspectionCollectsApi from "../api/inspectionCollects";
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";
import StatusPickerItem from "../components/StatusPickerItem";
import useAuth from "../auth/useAuth";
import MediaPicker from "../components/MediaPicker";
import colors from "../config/colors";
import { SessionContext } from "../context/SessionContext";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import AppPicker from "../components/AppPicker";
import { Media } from "../components/ImageInput";

export default function InspectionCollectEditScreen({ route }: any) {
  const { user } = useAuth();
  const toast = useToast();
  const { navigate } = useNavigation();
  const { workStatus, publicWorks } = useContext(SessionContext);

  const getPublicWorkStatusFromFlag = (id: number) => {
    return workStatus.find((option: any) => option.flag === id)?.name;
  };

  const [comments, setComments] = useState(
    route.params.collect ? route.params.collect.comments : ""
  );
  const [status, setStatus] = useState(
    route.params.collect
      ? getPublicWorkStatusFromFlag(route.params.collect.public_work_status)
      : null
  );
  const [images, setImages] = useState<Media[]>([]);

  const inspection = route.params.inspection;

  const publicWork = publicWorks.find(
    (publicWork) => inspection.public_work_id === publicWork.id
  );

  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateInput = () => {
    if (images.length === 0) {
      toast.show({
        title: "Envie ao menos uma mídia",
        placement: "top",
        bgColor: "red.600",
      });
      return false;
    }
    if (comments.trim().length === 0) {
      toast.show({
        title: "Comentários gerais não pode ser vazio",
        placement: "top",
        bgColor: "red.600",
      });
      return false;
    }
    if (!status) {
      toast.show({
        title: "Status da obra não pode ser vazio",
        placement: "top",
        bgColor: "red.600",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;
    Alert.alert(
      "Confirmar envio?",
      "Os dados da vistoria não poderão ser alterados após o envio!",
      [
        {
          text: "Cancelar",
          onPress: () => {},
        },
        {
          text: "Confirmar",
          onPress: () => {
            handleConfirm();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleConfirm = async () => {
    setProgress(0);
    setUploadVisible(true);

    const collect = {
      comments: comments,
      status: status,
      images: images,
    };

    const result = await inspectionCollectsApi.addInspectionCollect(
      { ...collect, inspection, publicWork, location, user },
      (progress: number) => setProgress(progress)
    );

    console.log(result);

    if (!result.ok) {
      setUploadVisible(false);
      return toast.show({
        title: "Não foi possível enviar a vistoria.",
        placement: "top",
        bgColor: "red.600",
      });
    }
    toast.show({
      title: "Vistoria enviada com sucesso",
      placement: "top",
      bgColor: "green.600",
      color: colors.black,
    });
    navigate(routes.INSPECTIONS);

    resetForm();
  };

  const resetForm = () => {
    setComments("");
    setStatus(null);
    setImages([]);
  };

  return (
    <View style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <View style={styles.iconPhoto}>
        <MediaPicker images={images} setImages={setImages} />
      </View>
      <View>
        <AppTextInput
          maxLength={255}
          name="comments"
          multiline
          placeholder="Comentários gerais"
          onChangeText={setComments}
          value={comments}
        />
        <AppPicker
          items={workStatus}
          name="status"
          numberOfColumns={1}
          PickerItemComponent={StatusPickerItem}
          placeholder="Status da obra"
          width="100%"
          onSelectItem={setStatus}
          selectedItem={status}
        ></AppPicker>
        <AppButton
          color={colors.trenaGreen}
          title="Confirmar"
          onPress={handleSubmit}
        />
      </View>
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
