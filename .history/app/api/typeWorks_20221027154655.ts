import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/typeworks/" + apiParam;

const getTypeWorks = () => client.get(endpoint);

export default {
  getTypeWorks,
};
