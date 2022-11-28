import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/photos/" + apiParam;

const getPhotos = () => client.get(endpoint);

export default {
  getPhotos,
};
