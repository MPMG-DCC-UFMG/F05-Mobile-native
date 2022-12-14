import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ImageInput, { Media } from "./ImageInput";

export default function ImageInputList({
  medias = [],
  onAddMedia,
  onRemoveMedia,
}: any) {
  const scrollView = useRef<any>();

  return (
    <View>
      <ScrollView
        ref={scrollView}
        horizontal
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        <View style={styles.container}>
          {medias.map((media: Media) => {
            return (
              <View style={styles.image} key={media.uri}>
                <ImageInput
                  media={media}
                  onChangeMedia={() => onRemoveMedia(media)}
                ></ImageInput>
              </View>
            );
          })}
          <ImageInput
            onChangeMedia={(media: Media) => onAddMedia(media)}
          ></ImageInput>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    marginRight: 8,
  },
});
