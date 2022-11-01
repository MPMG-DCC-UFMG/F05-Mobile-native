import { useContext } from "react"
import jwtDecode from "jwt-decode"

import AuthContext from "./context";
import authStorage from "./storage";
import { environment } from "../../enviroment";
import users from "../api/users";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/security/users/me" + apiParam;

export default function useAuth() {
  const {user, setUser, userData} = useContext(AuthContext);

  const logIn = (authToken: any) => {
    const user = jwtDecode(authToken);
    setUser(user);
    const userData = users.getUserData(authToken)
    console.log("User:", user)
    authStorage.storeToken(authToken);
  }

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  }

  return {user, logIn, logOut, setUser, userData};
}