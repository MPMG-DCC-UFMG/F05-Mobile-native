import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";

import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";
import auth from "../api/auth";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import ActivityIndicatior from "../components/ActivityIndicatior";
import colors from "../config/colors";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { useToast, View } from "native-base";

export default function RegisterScreen() {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const auth = useAuth();

  const validateInput = () => {
    if (email.trim().length === 0) {
      toast.show({
        title: "Email não pode ser vazio",
        placement: "top",
        bgColor: "red.600",
      });
      return false;
    }
    if (password.trim().length < 8) {
      toast.show({
        title: "Senha deve ter ao menos 8 caracteres",
        placement: "top",
        bgColor: "red.600",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    const userInfo = { name, email, password };
    const result: any = await registerApi.request(userInfo);
    console.log(result);

    if (!result.ok) {
      return toast.show({
        title: "Erro ao criar usuário",
        placement: "top",
        bgColor: "red.500",
      });
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
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/trena_dark.png")}
          ></Image>
        </View>
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="account"
          name="name"
          placeholder="Nome"
          onChangeText={setName}
          value={name}
        />
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContetType="emailAddress"
          onChangeText={setEmail}
          value={email}
        />
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Senha"
          secureTextEntry
          textContetType="password"
          onChangeText={setPassword}
          value={password}
        />
        <AppButton
          color={colors.trenaGreen}
          title="Cadastrar"
          onPress={handleSubmit}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    padding: 12,
    backgroundColor: colors.black,
  },
  logo: {
    height: 100,
    width: 200,
  },
  logoContainer: {
    padding: 12,
    paddingTop: 48,
    alignItems: "center",
  },
});
