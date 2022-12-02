import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View, Dimensions, Text } from "react-native";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";

import { PublicWork, SessionContext } from "../context/SessionContext";
import StatusPickerItem from "../components/StatusPickerItem";
import AppPicker from "../components/AppPicker";
import publicWorksApi from "../api/publicWorks";
import useLocation from "../hooks/useLocation";
import { Button, useToast } from "native-base";
import ActivityIndicatior from "../components/ActivityIndicatior";
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";
import { TouchableOpacity } from "react-native-gesture-handler";
import ButtonSecondary from "../components/ButtonSecondary";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PublicWorkAddScreen({ navigation, route }: any) {
  const { typeWorks } = useContext(SessionContext);
  const [type, setType] = useState<any>();
  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [cityState, setCityState] = useState("");
  const [number, setNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const { latitude, longitude } = useLocation();
  const toast = useToast();
  const { navigate } = useNavigation();

  const validateInput = () => {
    if (!type) {
      toast.show({
        title: "Tipo de obra não pode ser vazio",
        placement: "top",
        bgColor: "red.500",
      });
      return false;
    }
    if (name.trim().length === 0) {
      toast.show({
        title: "Nome da obra não pode ser vazio",
        placement: "top",
        bgColor: "red.500",
      });
      return false;
    }
    if (address.trim().length === 0) {
      toast.show({
        title: "Rua não pode ser vazio",
        placement: "top",
        bgColor: "red.500",
      });
      return false;
    }
    if (cep.trim().length === 0) {
      toast.show({
        title: "CEP não pode ser vazio",
        placement: "top",
        bgColor: "red.500",
      });
      return false;
    }
    if (number.trim().length === 0) {
      toast.show({
        title: "Número não pode ser vazio",
        placement: "top",
        bgColor: "red.500",
      });
      return false;
    }
    if (district.trim().length === 0) {
      toast.show({
        title: "Bairro não pode ser vazio",
        placement: "top",
        bgColor: "red.500",
      });
      return false;
    }
    if (cityState.trim().length === 0) {
      toast.show({
        title: "Cidade não pode ser vazio",
        placement: "top",
        bgColor: "red.500",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    Alert.alert(
      "Confirmar envio?",
      "Após sua confirmação, um agente do MPMG irá analisar o seu envio e disponibilizar na plataforma!",
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
    const [city, state] = cityState.split("-");

    const publicWorkId = uuid.v4();
    const addressId = uuid.v4();

    const publicWorkToSend = {
      id: publicWorkId,
      name: name.trim(),
      type_work_flag: type.flag,
      user_status: 0,
      queue_status: 0,
      queue_status_date: Date.now(),
      rnn_status: 0,
      address: {
        id: addressId,
        street: address.trim(),
        neighborhood: district.trim(),
        number: number.trim(),
        latitude: latitude,
        longitude: longitude,
        city: city.trim(),
        state: state.trim(),
        cep: cep.trim(),
        public_work_id: publicWorkId,
      },
    } as PublicWork;

    const result = await publicWorksApi.addPublicWork(
      publicWorkToSend,
      (progress: number) => setProgress(progress)
    );
    console.log(result);
    if (!result.ok) {
      setUploadVisible(false);
      return toast.show({
        title: "Não foi possível enviar a Obra",
        placement: "top",
        bgColor: "red.500",
      });
    }
    toast.show({
      title: "Obra enviada com sucesso",
      placement: "top",
      bgColor: colors.trenaGreen,
      color: colors.black,
    });
    navigate(routes.PUBLIC_WORKS);
  };

  useEffect(() => {
    if (cep.length < 8) return;
    setIsLoading(true);
    fetch(`https://ws.apicep.com/cep/${cep}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setCityState(`${data.city} - ${data.state}`);
          setAddress(`${data.address}`);
          setDistrict(data.district);
        } else {
          toast.show({
            title: "CEP informado não foi encontrado",
            placement: "top",
            bgColor: "red.500",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.show({
          title: "Não foi possível carregar dados pelo CEP",
          placement: "top",
          bgColor: "red.500",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [cep.length >= 8]);

  return (
    <>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <ActivityIndicatior visible={isLoading} />
      <Screen style={styles.screen}>
        <View style={styles.formView}>
          <AppPicker
            items={typeWorks}
            numberOfColumns={1}
            onSelectItem={(item: any) => {
              console.log(item);
              setType(item);
            }}
            PickerItemComponent={StatusPickerItem}
            placeholder="Tipo de obra"
            width="100%"
            selectedItem={type}
          />
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            caretHidden={false}
            name="name"
            placeholder="Nome da obra"
            onChangeText={setName}
            value={name}
          />
          <View style={styles.smallFormView}>
            <AppTextInput
              autoCapitalize="words"
              autoCorrect={false}
              name="cep"
              maxLength={8}
              width={windowWidth / 2 - 23}
              placeholder="CEP"
              keyboardType="numeric"
              onChangeText={(text) => setCep(text)}
              value={cep}
            />
            <AppTextInput
              autoCapitalize="words"
              autoCorrect={false}
              width={windowWidth / 2 - 23}
              name="number"
              placeholder="Número"
              keyboardType="numeric"
              onChangeText={setNumber}
              value={number}
            />
          </View>
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            name="address"
            placeholder="Rua"
            onChangeText={setCep}
            value={address}
          />
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            name="district"
            placeholder="Bairro"
            onChangeText={setDistrict}
            value={district}
          />
          <AppTextInput
            autoCapitalize="words"
            autoCorrect={false}
            name="city"
            placeholder="Cidade"
            onChangeText={setCityState}
            value={cityState}
          />
          <ButtonSecondary
            color={colors.gray[800]}
            title="Validar localização"
            onPress={() => {}}
          ></ButtonSecondary>
          <AppButton
            onPress={handleSubmit}
            color={colors.trenaGreen}
            title="Adicionar obra"
          />
        </View>
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
  formView: {
    marginTop: "16%",
  },
  smallFormView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationButton: {
    color: colors.white,
    backgroundColor: colors.light,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
  },
  locationText: {
    color: colors.medium,
    fontSize: 16,
    paddingLeft: 32,
    fontWeight: "bold",
  },
});
