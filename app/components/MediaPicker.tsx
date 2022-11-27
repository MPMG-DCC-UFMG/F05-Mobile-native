import { useFormikContext } from "formik";
import React from "react";
import { Media } from "./ImageInput";
import ImageInputList from "./ImageInputList";

export default function MediaPicker({ images, setImages }) {
  const medias = images;

  const handleAdd = (mediaData: Media) => {
    setImages([...medias, mediaData]);
  };

  const handleRemove = (mediaData: Media) => {
    setImages(medias.filter((media: Media) => media.uri !== mediaData.uri));
  };

  return (
    <>
      <ImageInputList
        medias={medias}
        onAddMedia={handleAdd}
        onRemoveMedia={handleRemove}
      />
    </>
  );
}
