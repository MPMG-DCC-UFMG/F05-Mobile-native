import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View, Dimensions, Text } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";

import { SessionContext } from "../context/SessionContext";
import {
  AppForm,
  AppFormField,
  AppFormPicker,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import StatusPickerItem from "../components/StatusPickerItem";
import AppPicker from "../components/AppPicker";
import publicWorkCollects from "../api/publicWorkCollects";
import useLocation from "../hooks/useLocation";
import AppText from "../components/AppText";
import { useToast } from "native-base";
import ActivityIndicatior from "../components/ActivityIndicatior";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("O campo nome da obra é obrigatório"),
  street: Yup.string().required("O campo rua é obrigatório"),
  cep: Yup.string().required("O campo cep é obrigatório"),
  number: Yup.string().required("O campo número é obrigatório"),
  district: Yup.string().required("O campo bairro é obrigatório"),
  city: Yup.string().required("O campo cidade é obrigatório"),
});

export default function PublicWorkAddScreen({ navigation, route }: any) {
  const { typeWorks } = useContext(SessionContext);
  const [type, setType] = useState<any>();
  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const { latitude, longitude } = useLocation();
  const toast = useToast();

  const handleSubmit = async (
    { name, street, cep, number, district, city },
    formikBag: any
  ) => {
    setProgress(0);

    let teste = city.split("-");

    const result = (await publicWorkCollects.addPublicWorkCollect({
      name: name,
      type_work_flag: type.flag,
      address: {
        street: street,
        district: district,
        number: number,
        latitude: latitude,
        longitude: longitude,
        city: teste[0].replace(" ", ""),
        state: teste[1].replace(" ", ""),
        cep: cep,
      },
    })) as any;

    console.log(result);
  };

  useEffect(() => {
    if (cep.length < 8) return;
    setIsLoading(true);
    fetch(`https://ws.apicep.com/cep/${cep}.json`)
      .then((res) => res.json())
      .then((data) => {
        setCity(`${data.city} - ${data.state}`);
        setAddress(`${data.address}`);
        setDistrict(data.district);
        setError(false);
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
            autoCapitalize="none"
            autoCorrect={false}
            caretHidden={false}
            name="name"
            placeholder="Nome da obra"
            onChangeText={setName}
            value={name}
          />
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            name="address"
            placeholder="Rua"
            onChangeText={setCep}
            value={address}
          />
          <View style={styles.smallFormView}>
            <AppTextInput
              autoCapitalize="none"
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
              autoCapitalize="none"
              autoCorrect={false}
              width={windowWidth / 2 - 23}
              name="number"
              placeholder="Número"
            />
          </View>
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            name="district"
            placeholder="Bairro"
            onChangeText={setDistrict}
            value={district}
          />
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            name="city"
            placeholder="Cidade"
            onChangeText={setCity}
            value={city}
          />
          <AppButton color={colors.trenaGreen} title="Adicionar obra" />
        </View>

        <AppButton
          color={colors.danger}
          title="Validar localização"
          onPress={() => {}}
        ></AppButton>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    paddingBottom: 0,
    backgroundColor: colors.dark,
  },
  formView: {
    marginTop: "20%",
  },
  smallFormView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
