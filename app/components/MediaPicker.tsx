import { useFormikContext } from "formik";
import React from "react";
import ImageInputList from "./ImageInputList";

export default function FormMediaPicker({ images, setImages }) {
  const medias = images;

  const handleAdd = (mediaData) => {
    setImages([...medias, mediaData]);
  };

  const handleRemove = (mediaData) => {
    setImages(medias.filter((media) => media.uri !== mediaData.uri));
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
