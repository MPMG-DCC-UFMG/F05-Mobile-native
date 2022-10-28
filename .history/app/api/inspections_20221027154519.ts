import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.mpApiKey
const endpoint = "/inspections/" + apiParam;

console.log(endpoint)

const getInspections = () => client.get(endpoint);

export default {
  getInspections,
};
