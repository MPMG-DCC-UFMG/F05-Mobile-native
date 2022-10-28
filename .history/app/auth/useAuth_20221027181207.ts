import { useContext } from "react"
import jwtDecode from "jwt-decode"

import AuthContext from "./context";
import authStorage from "./storage";


export default function useAuth() {
  const {user, setUser} = useContext(AuthContext);

  const logIn = (authToken: any) => {
    const user = jwtDecode(authToken);
    setUser(user);
    console.log("User:", user)
    authStorage.storeToken(authToken);
  }

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  }

  return {user, logIn, logOut, setUser};
}