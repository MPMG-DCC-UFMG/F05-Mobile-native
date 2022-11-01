import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import usersApi from "../api/users";
import authApi from "../api/auth";
import auth from "../api/auth";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import ActivityIndicatior from "../components/ActivityIndicatior";
import colors from "../config/colors";

//Determines the rules for validating the form with yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("O campo Nome é obrigatório").label("Nome"),
  email: Yup.string()
    .required("O campo Email é obrigatório")
    .email()
    .label("Email"),
  password: Yup.string()
    .required("O campo senha é obrigatório")
    .min(4)
    .label("Senha"),
});

export default function RegisterScreen() {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);

  const auth = useAuth();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (userInfo: any) => {
    const result: any = await registerApi.request(userInfo);
    console.log(result);

    if (!result.ok) {
      if (result.data) setError(result.data.error);
      else {
        setError("Um erro inesperado ocorreu");
        console.log(result);
      }
      return;
    }

    const { data }: any = await loginApi.request(
      userInfo.email,
      userInfo.password
    );
    console.log("loginApi data: ", data);
    auth.logIn(data.access_token);
  };

  return (
    <>
      <ActivityIndicatior visible={registerApi.loading || loginApi.loading} />
      <Screen style={styles.container}>
        <AppForm
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="account"
            name="name"
            placeholder="Nome"
          ></AppFormField>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContetType="emailAddress"
          ></AppFormField>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Senha"
            secureTextEntry
            textContetType="password"
          ></AppFormField>
          <SubmitButton
            color={colors.trenaGreen}
            title="Cadastrar"
          ></SubmitButton>
        </AppForm>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 12,
    backgroundColor: colors.black,
  },
});
