import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.mpApiKey

const endpoint = "/publicworks/" + apiParam;

const getPublicWorks = () => client.get(endpoint);

// const addListings = (listing: any, onUploadProgress: any) => {
//   const data = new FormData();
//   data.append("title", listing.title);
//   data.append("price", listing.price);
//   data.append("categoryId", listing.category.value);
//   data.append("description", listing.description);
//   if (listing.location)
//     data.append("location", JSON.stringify(listing.location));
//   listing.images.forEach((image: string, index: number) => {
//     data.append("images", {
//       name: "image" + index,
//       type: "image/jpeg",
//       uri: image,
//     });
//   });

//   return client.post(endpoint, data, {
//     onUploadProgress: (progress) =>
//       onUploadProgress(progress.loaded / progress.total),
//   });
// };

export default {
  getPublicWorks,
  // addListings,
};
