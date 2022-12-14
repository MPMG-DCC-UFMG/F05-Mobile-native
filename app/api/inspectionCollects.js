import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpointCollects = "/collects/" + apiParam;
const endpointInspectionsUpdate = "/inspections/update" + apiParam;
const endpointPublicWorksUpdate = "/publicworks/update" + apiParam;
const endpointCollectsAdd = "/collects/add" + apiParam;
const endpointPhotoUpload = "/images/upload" + apiParam;
const endpointPhotoAdd = "/photos/add" + apiParam;

const getInspectionCollects = () => client.get(endpointCollects);

const addInspectionCollect = async (data, onUploadProgress) => {
  const timestamp = Date.now();

  const inspectionData = {
    ...data.inspection, status: 2
  }

  const responseInspection = await client.put(endpointInspectionsUpdate, inspectionData);
  console.log("inspection: ", responseInspection.ok)
  
  const publicWorkData = {
    ...data.publicWork, user_status: data.status.flag
  }
  
  const responsePublicWork = await client.put(endpointPublicWorksUpdate, publicWorkData);
  console.log("publicwork: ", responsePublicWork.ok)
  
  const inspectionCollectData = {
    public_work_id: data.inspection.public_work_id,
    inspection_flag: data.inspection.flag,
    date: timestamp,
    user_email: data.user.email,
    public_work_status: data.status.flag,
    comments: data.comments,
  };
  const response = await client.post(endpointCollectsAdd, inspectionCollectData);
  console.log("collect: ", response.ok)

 
  const photoFilesData = new FormData();
  let responsePhotoUpload;
  for (let index = 0; index < data.images.length; index++) {
    const media = data.images[index];
    
    // Identifiyng the media type/extension
    const imageUriParts = media.uri.split(".")
    const extension = imageUriParts[imageUriParts.length - 1]

    const photoData = {
      id: timestamp.toString(),
      collect_id: response.data.id,
      type: media.type.flag,
      filepath: "images/" + data.inspection.public_work_id + "_" + media.timestamp + "_" + index + "." + extension,
      latitude: media.latitude,
      longitude: media.longitude,
      comment: media.comments,
      timestamp: media.timestamp
    }
    const responsePhoto = await client.post(endpointPhotoAdd, photoData);
    console.log("photo: ", responsePhoto.ok)
   
    photoFilesData.append("file",  
         {
            name: data.inspection.public_work_id + "_" + media.timestamp + "_" + index + "." + extension,
            type: extension !== "mp4" ? "image/jpeg" : "video/mp4",
            uri: media.uri,
          },
    );
    responsePhotoUpload = await client.post(endpointPhotoUpload, photoFilesData, {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    });
    console.log("photoUpload: ", responsePhotoUpload.ok);
  }
  
  return responsePhotoUpload;
};

export default {
  getInspectionCollects,
  addInspectionCollect,
};
