import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/workstatus/" + apiParam;

const getWorkStatus = () => client.get(endpoint);

export default {
  getWorkStatus,
};
