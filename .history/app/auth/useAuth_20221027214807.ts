import { useContext } from "react"
import jwtDecode from "jwt-decode"

import AuthContext from "./context";
import authStorage from "./storage";
import { environment } from "../../enviroment";
import users from "../api/users";
import useApi from "../hooks/useApi";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/security/users/me" + apiParam;

export default function useAuth() {
  const {user, setUser, userData} = useContext(AuthContext);

  const logIn = async (authToken: any) => {
    const user = jwtDecode(authToken);
    setUser(user);

    const { data: userData, request: getUserData } = useApi(
      users.getUserData(authToken)
    );
    await getUserData();
    
    console.log("User:", user)
    console.log("UserData:", userData)
    authStorage.storeToken(authToken);
  }

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  }

  return {user, logIn, logOut, setUser, userData};
}