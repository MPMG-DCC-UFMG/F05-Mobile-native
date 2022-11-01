import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.mpApiKey

const endpoint = "/collects/" + apiParam;
const endpointAdd = "/collects/add" + apiParam;
const endpointPhotoUpload = "/images/upload" + apiParam;
const endpointPhotoAdd = "/photos/add" + apiParam;

const getCollects = () => client.get(endpoint);

const addCollect = async (data, onUploadProgress) => {
  const timestamp = Date.now();
  const collectData = {
    public_work_id: data.publicWork.id,
    inspection_flag: "",
    date: timestamp,
    user_email: data.user.email, //TODO get from userData
    public_work_status: data.status.flag,
    comments: data.comments,
  };
  const response = await client.post(endpointAdd, collectData);
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
      filepath: "images/" + data.publicWork.id + "_" + timestamp + "_" + index + "." + extension,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      comment: media.comments,
      timestamp: timestamp
    }
    const responsePhoto = await client.post(endpointPhotoAdd, photoData);
    console.log("photo: ", responsePhoto.ok)
   
    photoFilesData.append("file",  
         {
            name: data.publicWork.id + "_" + timestamp + "_" + index + "." + extension,
            type: extension !== "mp4" ? "image/jpeg" : "video/mp4",
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

//   const photoData = {
//     id: timestamp.toString(),
//     collect_id: response.data.id,
//     type: "1",
//     filepath: "images/" + data.publicWork.id + "_" + timestamp + ".jpeg",
//     latitude: data.location.latitude,
//     longitude: data.location.longitude,
//     comment: "teste",
//     timestamp: timestamp
//   }
//   const responsePhoto = await client.post(endpointPhotoAdd, photoData);
//   console.log("photo: ", responsePhoto.ok)
  
//   const photoFilesData = new FormData();
//   data.images.forEach((image, index) => {
//     photoFilesData.append("file",  
//          {
//             name: data.publicWork.id + "_" + timestamp + ".jpeg",
//             type: "image/jpeg",
//             uri: image,
//           },
//     );
//   });
//   const responsePhotoUpload = await client.post(endpointPhotoUpload, photoFilesData, {
//     onUploadProgress: (progress) =>
//       onUploadProgress(progress.loaded / progress.total),
//   });
//   console.log("photoUpload: ", responsePhotoUpload.ok);
//   return responsePhotoUpload;
// };

export default {
  getCollects,
  addCollect,
};
