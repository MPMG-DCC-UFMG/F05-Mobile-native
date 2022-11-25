import { environment } from "../../enviroment";
import { PublicWork } from "../screens/PublicWorksScreen";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/publicworks/" + apiParam;
const endpointAdd = "/publicworks/add" + apiParam;
const endpointUpdate = "/publicworks/update" + apiParam;

const getPublicWorks = () => client.get(endpoint);

const addPublicWork = (publicWork: PublicWork, onUploadProgress: any) => {
  return client.post(endpointAdd, publicWork, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

const updatePublicWork = (publicWork: PublicWork, onUploadProgress: any) => {
  return client.post(endpointUpdate, publicWork, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  getPublicWorks,
  addPublicWork,
  updatePublicWork
};
