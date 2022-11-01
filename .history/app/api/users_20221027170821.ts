import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/security/users/create" + apiParam;

// const getUsers = () => client.get(endpoint);

const register = (userInfo: any) => {
  const user = {
    "email": userInfo.email,
    "authentication": userInfo.password,
    "full_name": userInfo.name,
    "profile_pic": userInfo.photoUri,
    "role": "NORMAL"
  }
  console.log(user)
  return client.post(endpoint, user)
};

export default {
  register,
};
