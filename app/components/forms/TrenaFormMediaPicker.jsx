import { useFormikContext } from "formik";
import React from "react";

import ErrorMessage from "./ErrorMessage";
import ImageInputList from "../ImageInputList";

export default function TrenaFormMediaPicker({ name }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const medias = values[name];

  const handleAdd = (mediaData) => {
    setFieldValue(name, [...medias, mediaData]);
  };

  const handleRemove = (mediaData) => {
    setFieldValue(
      name,
      medias.filter((media) => media.uri !== mediaData.uri)
    );
  };

  return (
    <>
      <ImageInputList
        medias={medias}
        onAddMedia={handleAdd}
        onRemoveMedia={handleRemove}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]}></ErrorMessage>
    </>
  );
}
