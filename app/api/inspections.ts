import { environment } from "../../enviroment";
import { Inspection } from "../screens/InspectionsScreen";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey
const endpoint = "/inspections/" + apiParam;
const endpointUpdate = "/inspections/update" + apiParam;

console.log(endpoint)

const getInspections = () => client.get(endpoint);

const updateInspection = (inspection: Inspection, onUploadProgress: any) => {
  return client.post(endpointUpdate, inspection, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  getInspections,
  updateInspection
};
