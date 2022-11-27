import { useContext } from "react"
import jwtDecode from "jwt-decode"

import AuthContext from "./context";
import authStorage from "./storage";
import { environment } from "../../enviroment";
import apiClient from "../api/client";
import storeUserData from "./storeUserData";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/security/users/me" + apiParam;

export default function useAuth() {
  const {user, setUser} = useContext(AuthContext);

  const logIn = async (authToken: string) => {
    const user = await jwtDecode(authToken);
    setUser(user);

    const {data: userData} = await apiClient.get(endpoint + "&token=" + authToken);    
    storeUserData.storeUser(userData)

    await authStorage.storeToken(authToken);
  }

  const logOut = async () => {
    setUser(null);
    await authStorage.removeToken();
  }

  return {user, logIn, logOut, setUser};
}