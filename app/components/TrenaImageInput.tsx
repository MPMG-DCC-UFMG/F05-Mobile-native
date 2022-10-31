import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Yup from "yup";
import { Camera, CameraType } from 'expo-camera';

import colors from "../config/colors";
import AppButton from "./AppButton";
import {
  ErrorMessage,
} from "./forms";
import StatusPickerItem from "./StatusPickerItem";
import AppTextInput from "./AppTextInput";
import AppPicker from "./AppPicker";
import { SessionContext } from "../context/SessionContext";
import routes from "../navigation/routes";

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

const validationSchema = Yup.object().shape({
  comments: Yup.string().label("Comentário"),
  type: Yup.object()
    .required("Tipo é um campo obrigatório")
    .nullable()
    .label("Tipo"),
  images: Yup.array().min(1, "O envio de mídia é obrigatório"),
});

export default function TrenaImageInput({ media, onChangeMedia, navigation }: any) {
  const { typePhotos } = useContext(SessionContext);
  const [currentImageUri, setCurrentImageUri] = useState(
    media ? media.uri : undefined
  );
  const [comments, setComments] = useState<string>(media ? media.comments : "");
  const [type, setType] = useState<string>(media ? media.type : "");
  const [typeVideo, setTypeVideo] = useState(CameraType.back);
  const [submited, setSubmited] = useState(false);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted)
      alert("Você precisa permitir o acesso a câmera do dispositivo");
  };

  const handlePress = () => {
    if (!media) setModalVisible(true);
    else
      Alert.alert("Deletar", "Tem certeza que deseja deletar essa imagem?", [
        {
          text: "Não",
        },
        {
          text: "Sim",
          onPress: () => onChangeMedia(null),
        },
      ]);
  };

  const handleSubmit = () => {
    setSubmited(true);
    if (currentImageUri && type !== "") {
      onChangeMedia({ uri: currentImageUri, comments: comments, type: type });
      setModalVisible(false);
      setCurrentImageUri("");
      setComments("");
      setType("");
      setSubmited(false);
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.5,
      });
      if (!result.cancelled) {
        setCurrentImageUri(result.uri);
      }
    } catch (error) {
      console.log("Erro ao carregar a imagem", error);
    }
  };

  function handleVideo() {
    navigation.navigate(routes.GET_VIDEO)
  }


  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.cameraIconSmallContainer}>
          {media ? (
            <Image source={{ uri: media.uri }} style={styles.image}></Image>
          ) : (
            <MaterialCommunityIcons
              name="camera-plus"
              size={40}
              color={colors.medium}
            ></MaterialCommunityIcons>
          )}
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        {/* <Screen> */}
        <View style={styles.modalContainer}>
          <View style={styles.closeButton}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={40}
                color={colors.trenaGreen}
              ></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={selectImage}>
              <View style={styles.cameraIconLargeContainer}>
                {currentImageUri ? (
                  <Image
                    source={{ uri: currentImageUri }}
                    style={styles.image}
                  ></Image>
                ) : (
                  <MaterialCommunityIcons
                    name="camera"
                    size={40}
                    color={colors.medium}
                  ></MaterialCommunityIcons>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert("Em construção")}>
              <View style={styles.cameraIconLargeContainer}>
                {currentImageUri ? (
                  <Image
                    source={{ uri: currentImageUri }}
                    style={styles.image}
                  ></Image>
                ) : (
                  <MaterialCommunityIcons
                    name="video"
                    size={40}
                    color={colors.medium}
                  ></MaterialCommunityIcons>
                )}
              </View>
            </TouchableOpacity>

          </View>
          <ErrorMessage
            error={"Favor enviar uma foto ou vídeo"}
            visible={currentImageUri === undefined && submited === true}
          ></ErrorMessage>
          <AppTextInput
            maxLength={255}
            name="comments"
            multiline
            value={comments}
            onChangeText={(text: string) => setComments(text)}
            placeholder="Comentários"
          />
          <AppPicker
            items={typePhotos}
            numberOfColumns={1}
            onSelectItem={(item: any) => {
              console.log(item);
              setType(item);
            }}
            PickerItemComponent={StatusPickerItem}
            placeholder="Tipo"
            width="60%"
            selectedItem={type}
          ></AppPicker>
          <ErrorMessage
            error={"Tipo é um campo obrigatório"}
            visible={type === "" && submited === true}
          ></ErrorMessage>
          <AppButton
            color={colors.trenaGreen}
            title="Adicionar"
            onPress={handleSubmit}
          />
        </View>
        {/* </Screen> */}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 12,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.black,
    paddingTop: "10%"
  },
  cameraIconSmallContainer: {
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 4,
    height: 100,
    justifyContent: "center",
    width: 100,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10
  },
  cameraIconLargeContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.light,
    borderRadius: 4,
    height: 100,
    justifyContent: "center",
    width: 100,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    marginRight: 10,
  },
  image: {
    borderRadius: 4,
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
});
