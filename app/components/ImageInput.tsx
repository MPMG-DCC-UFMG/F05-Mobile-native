import { useContext, useEffect, useState } from "react";
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
import { CameraType } from "expo-camera";

import colors from "../config/colors";
import AppButton from "./AppButton";
import StatusPickerItem from "./StatusPickerItem";
import AppTextInput from "./AppTextInput";
import AppPicker from "./AppPicker";
import { SessionContext } from "../context/SessionContext";
import AppText from "./AppText";
import useLocation from "../hooks/useLocation";

interface ImagePickerResult {
  assetId: any;
  base64: any;
  cancelled: boolean;
  exif: any;
  height: number;
  type: string;
  uri: string;
  width: number;
}

export interface Media {
  type: string;
  uri: string;
  latitude: number;
  longitude: number;
  comment: string;
  timestamp: number;
}

interface ImageInputProps {
  media?: Media;
  onChangeMedia: any;
}

export default function ImageInput({ media, onChangeMedia }: ImageInputProps) {
  const { typePhotos } = useContext(SessionContext);
  const location = useLocation();
  const [currentImageUri, setCurrentImageUri] = useState(
    media ? media.uri : undefined
  );
  const [comments, setComments] = useState<string>(media ? media.comment : "");
  const [type, setType] = useState<string>(media ? media.type : "");
  const [typeVideo, setTypeVideo] = useState(CameraType.back);
  const [submited, setSubmited] = useState(false);
  const [mediaTypeIsPhoto, setMediaTypeIsPhoto] = useState(true);

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
    if (!media) {
      Alert.alert(
        "Tipo de mídia",
        "Qual tipo de mídia deseja enviar?",
        [
          {
            text: "Vídeo",
            onPress: () => {
              setMediaTypeIsPhoto(false);
              setModalVisible(true);
              selectVideo();
            },
          },
          {
            text: "Foto",
            onPress: () => {
              setMediaTypeIsPhoto(true);
              setModalVisible(true);
              selectImage();
            },
          },
        ],
        { cancelable: true }
      );
    } else
      Alert.alert(
        "Deletar",
        "Tem certeza que deseja deletar essa imagem?",
        [
          {
            text: "Não",
          },
          {
            text: "Sim",
            onPress: () => onChangeMedia(null),
          },
        ],
        { cancelable: true }
      );
  };

  const handleSubmit = () => {
    setSubmited(true);
    if (currentImageUri && type !== "") {
      onChangeMedia({
        uri: currentImageUri,
        comments: comments,
        type: type,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
      });
      setModalVisible(false);
      setCurrentImageUri("");
      setComments("");
      setType("");
      setSubmited(false);
    }
  };

  const selectImage = async () => {
    try {
      const result = (await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.5,
      })) as ImagePickerResult;
      console.log(result);
      if (!result.cancelled) {
        setCurrentImageUri(result.uri);
      }
    } catch (error) {
      console.log("Erro ao carregar a imagem", error);
    }
  };

  const selectVideo = async () => {
    try {
      const result = (await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        aspect: [16, 9],
      })) as ImagePickerResult;
      if (!result.cancelled) {
        setCurrentImageUri(result.uri);
      }
    } catch (error) {
      console.log("Erro ao carregar o vídeo", error);
    }
  };

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
              color={colors.gray[300]}
            ></MaterialCommunityIcons>
          )}
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <AppText color={colors.white}>{`Adicionar ${
              mediaTypeIsPhoto ? "foto" : "vídeo"
            }`}</AppText>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={40}
                color={colors.trenaGreen}
              ></MaterialCommunityIcons>
            </TouchableOpacity>
          </View>
          <View style={styles.headerContainer}>
            {mediaTypeIsPhoto ? (
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
                      color={colors.gray[300]}
                    ></MaterialCommunityIcons>
                  )}
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={selectVideo}>
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
                      color={colors.gray[300]}
                    ></MaterialCommunityIcons>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
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
            placeholder="Tipo de foto"
            width="100%"
            selectedItem={type}
          ></AppPicker>
          <AppButton
            color={colors.trenaGreen}
            title="Adicionar"
            onPress={handleSubmit}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 8,
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: colors.black,
    paddingTop: "10%",
  },
  cameraIconSmallContainer: {
    alignItems: "center",
    backgroundColor: colors.gray[800],
    borderRadius: 4,
    height: 100,
    justifyContent: "center",
    width: 100,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  cameraIconLargeContainer: {
    alignItems: "center",
    backgroundColor: colors.gray[800],
    borderRadius: 4,
    height: 200,
    justifyContent: "center",
    width: 200,
    borderColor: colors.trenaGreen,
    borderWidth: 1,
    marginRight: 10,
  },
  image: {
    borderRadius: 4,
    height: "100%",
    overflow: "hidden",
    width: "100%",
    color: colors.gray[300],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
});
