import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ImageInput from "./ImageInput";
import TrenaImageInput from "./TrenaImageInput";

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
          {medias.map((media: any) => {
            return (
              <View style={styles.image} key={media.uri}>
                <TrenaImageInput
                  media={media}
                  onChangeMedia={() => onRemoveMedia(media)}
                ></TrenaImageInput>
              </View>
            );
          })}
          <TrenaImageInput
            onChangeMedia={(media: any) => onAddMedia(media)}
          ></TrenaImageInput>
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
