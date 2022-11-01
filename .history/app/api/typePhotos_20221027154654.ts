import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/typephotos/" + apiParam;

const getTypePhotos = () => client.get(endpoint);

export default {
  getTypePhotos,
};
