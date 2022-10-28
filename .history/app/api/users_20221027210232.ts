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
  console.log(user)
  return client.post(endpoint, user)
};

const getUserData = (token: string) => client.get(endpointMe, token);

export default {
  register,
  getUserData
};
