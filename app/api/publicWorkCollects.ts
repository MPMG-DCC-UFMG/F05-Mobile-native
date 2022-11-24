import { environment } from "../../enviroment";
import client from "./client";
import uuid from 'react-native-uuid';

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpointAdd = "/publicworks/add" + apiParam;



const id = uuid.v4()

const addPublicWorkCollect = async (data) => {

  const publicWorkCollectData = {
    id: id,
    name: data.name,
    type_work_flag: data.type_work_flag,
    address: {
      street: data.address.street,
      neighborhood: data.address.neighborhood,
      number: data.address.number,
      latitude: data.address.latitude,
      longitude: data.address.longitude,
      city: data.address.city,
      state: data.address.state,
      cep: data.address.cep,
      public_work_id: id,
    },
    user_status: 0,
    rnn_status: 0
  };
  const response = await client.post(endpointAdd, publicWorkCollectData);
  console.log("publicWorkCollect: ", response.ok)

};

export default {
  addPublicWorkCollect,
};
