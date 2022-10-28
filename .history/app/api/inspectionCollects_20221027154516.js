import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.mpApiKey

const endpoint = "/collects/" + apiParam;
const endpointAdd = "/collects/add" + apiParam;
const endpointPhotoUpload = "/images/upload" + apiParam;
const endpointPhotoAdd = "/photos/add" + apiParam;

const getInspectionCollects = () => client.get(endpoint);

const addInspectionCollect = async (data, onUploadProgress) => {
  const timestamp = Date.now();
  const inspectionCollectData = {
    public_work_id: data.inspection.public_work_id,
    inspection_flag: data.inspection.flag,
    date: timestamp,
    user_email: data.user.email,
    public_work_status: data.status.flag,
    comments: data.comments,
  };
  const response = await client.post(endpointAdd, inspectionCollectData);
  console.log("collect: ", response.ok)

 
  const photoFilesData = new FormData();
  for (let index = 0; index < data.images.length; index++) {
    const media = data.images[index];
    
  // }
  // data.images.forEach(async (media, index) => {

    // Identifiyng the media type/extension
    const imageUriParts = media.uri.split(".")
    const extension = imageUriParts[imageUriParts.length - 1]

    const photoData = {
      id: timestamp.toString(),
      collect_id: response.data.id,
      type: media.type.flag,
      filepath: "images/" + data.inspection.public_work_id + "_" + timestamp + "_" + index + "." + extension,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      comment: media.comments,
      timestamp: timestamp
    }
    const responsePhoto = await client.post(endpointPhotoAdd, photoData);
    console.log("photo: ", responsePhoto.ok)
   
    photoFilesData.append("file",  
         {
            name: data.inspection.public_work_id + "_" + timestamp + "_" + index + "." + extension,
            type: extension !== "mp4" ? "image/jpeg" : "video/mp4", //TODO allow videos
            uri: media.uri,
          },
    );
    const responsePhotoUpload = await client.post(endpointPhotoUpload, photoFilesData, {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    });
    console.log("photoUpload: ", responsePhotoUpload.ok);
  }//);
  return responsePhotoUpload;
};

export default {
  getInspectionCollects,
  addInspectionCollect,
};
