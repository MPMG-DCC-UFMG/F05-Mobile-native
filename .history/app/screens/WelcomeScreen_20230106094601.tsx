import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LogBox } from "react-native";

import useAuth from "../auth/useAuth";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import routes from "../navigation/routes";
import authApi from "../api/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppText from "../components/AppText";
import ListItemSeparator from "../components/ListItemSeparator";
import * as AuthSession from "expo-auth-session";
import useApi from "../hooks/useApi";
import usersApi from "../api/users";
import { environment } from "../../enviroment";
import { useToast } from "native-base";
import AppTextInput from "../components/AppTextInput";
import { SessionContext } from "../context/SessionContext";

interface AuthResponse {
  params: {
    access_token: string;
  };
  type: string;
}

export default function WelcomeScreen() {
  // Load all data from api
  const { loadDataFromServer } = useContext(SessionContext);

  useEffect(() => {
    loadDataFromServer();
  }, []);

  LogBox.ignoreLogs(["EventEmitter.removeListener"]);
  // fetch(
  //   "https://viacep.com.br/ws/35931333/json"
  //   // "https://optables.com.br/typeworks/?X-TRENA-KEY=0a944fb8-2bbc-4f03-a81a-bf84899cd4f2"
  // )
  //   .then((response) => {
  //     response.json();
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })
  //   .then((data) => console.log(data));

  fetch(`https://ws.apicep.com/cep/35931333.json`)
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        console.log(data);
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

  const toast = useToast();
  const navigation = useNavigation();
  const auth = useAuth();
  const loginApi = useApi(authApi.login);
  const registerApi = useApi(usersApi.register);

  const [email, setEmail] = useState("george@trena.mpmg.mg.br");
  const [password, setPassword] = useState("12345678aA");
  const [showLogo, setShowLogo] = useState(true);

  async function handleGoogleSignIn() {
    try {
      // Connect to google oauth API
      const CLIENT_ID = environment.googleClientId;
      const REDIRECT_URI = "https://auth.expo.io/@fonseca90/trena";
      const SCOPE = encodeURI("profile email");
      const RESPONSE_TYPE = "token";

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthResponse;
      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const user = await response.json();

        // Register a new user using the token (10 first chars) as password
        const result: any = await registerApi.request({
          name: user.name,
          email: user.email,
          picture: user.picture,
          password: params.access_token.substring(0, 10),
        });

        // Login with created email and password
        const { data }: any = await loginApi.request(
          user.email,
          params.access_token.substring(0, 10)
        );
        auth.logIn(data.access_token);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const validateInput = () => {
    if (email.trim().length === 0) {
      toast.show({
        title: "Email não pode ser vazio",
        placement: "top",
        bgColor: "red.600",
      });
      return false;
    }
    if (password.trim().length === 0) {
      toast.show({
        title: "Senha não pode ser vazio",
        placement: "top",
        bgColor: "red.600",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    const result = (await authApi.login(email, password)) as any;
    if (!result.ok) {
      return toast.show({
        title: "Email ou senha inválidos",
        placement: "top",
        bgColor: "red.500",
      });
    }
    console.log(result.data.access_token);
    auth.logIn(result.data.access_token);
  };

  function keyboardDidShow() {
    setShowLogo(false);
  }

  function keyboardDidHide() {
    setShowLogo(true);
  }

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);
  }, [Keyboard]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/trena_dark.png")}
            ></Image>
          </View>
        )}
        <View style={styles.buttonsContainer}>
          <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={"email"}
            icon="email"
            // keyboardType="email-address"
            name="email"
            placeholder="Email"
            // textContetType="emailAddress"
            onChangeText={setEmail}
            value={email}
            // Issue on react-native: https://github.com/facebook/react-native/issues/32782
            // caretHidden={false}
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
            title="Entrar"
            onPress={handleSubmit}
          />
          <View style={styles.registerContainer}>
            <AppText style={styles.newUserText}>Não tem conta?</AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.REGISTER)}
            >
              <AppText style={styles.registerText}>Cadastre aqui</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.registerContainer}>
            <ListItemSeparator />
            <AppText style={styles.registerText}>OU</AppText>
            <ListItemSeparator />
          </View>
          <TouchableOpacity onPress={handleGoogleSignIn}>
            <View style={styles.googleButton}>
              <Image
                style={styles.socialIcon}
                source={require("../assets/google.png")}
              ></Image>
              <Text style={styles.googleText}>Entrar com Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Disponível em breve")}>
            <View style={styles.facebookButton}>
              <Image
                style={styles.socialIcon}
                source={require("../assets/facebook.png")}
              ></Image>
              <Text style={styles.facebookText}>Entrar com Facebook</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
    marginTop: 20,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  registerText: {
    paddingLeft: 8,
    paddingRight: 8,
    color: colors.trenaGreen,
  },
  logo: {
    height: 200,
    width: 200,
  },
  loginButton: {
    backgroundColor: "#73FF00",
  },
  logoContainer: {
    padding: 12,
    alignItems: "center",
  },
  googleButton: {
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
  googleText: {
    color: colors.medium,
    fontSize: 18,
    paddingLeft: 32,
    fontWeight: "bold",
  },
  facebookButton: {
    color: colors.white,
    backgroundColor: colors.facebookBlue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  facebookText: {
    color: colors.light,
    // textTransform: "uppercase",
    paddingLeft: 32,
    fontSize: 18,
    fontWeight: "bold",
  },
  tagLine: {
    fontSize: 24,
    fontWeight: "600",
    paddingVertical: 20,
  },
  newUserText: {
    color: colors.light,
  },
});
