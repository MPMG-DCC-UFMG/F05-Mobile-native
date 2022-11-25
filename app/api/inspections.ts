import { environment } from "../../enviroment";
import { Inspection } from "../screens/InspectionsScreen";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey
const endpoint = "/inspections/" + apiParam;
const endpointUpdate = "/inspections/update" + apiParam;

const getInspections = () => client.get(endpoint);

const updateInspection = (inspection: Inspection, onUploadProgress: any) => {
  return client.put(endpointUpdate, inspection, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

const downloadReport = (inspection: Inspection) => client.get(`/inspections/report/${inspection.flag}/${apiParam}`);


export default {
  getInspections,
  updateInspection,
  downloadReport
};
