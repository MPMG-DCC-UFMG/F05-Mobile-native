import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/security/users/create" + apiParam;
const endpointMe = "/security/users/me" + apiParam;

// const getUsers = () => client.get(endpoint);

const register = (userInfo: any) => {
  const user = {
    "email": userInfo.email,
    "authentication": userInfo.password,
    "full_name": userInfo.name,
    "picture": userInfo.picture,
    "role": "NORMAL"
  }
  return client.post(endpoint, user)
};

const getUserData = (token: string) => {
  return client.get(endpointMe + "&token=" + token);
}

export default {
  register,
  getUserData
};
