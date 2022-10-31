import React, { useContext, useEffect, useState } from "react";
import { Camera, Constants } from 'expo-camera';
import {
  Alert,
  Image,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";


import colors from "../config/colors";
import AppButton from "./AppButton";



interface MediaProps {
  modalSelect: boolean;
}

export default function TrenaVideoInput() {
  const [modalVisible, setModalVisible] = useState(false)



  function handleVideo() {

  }

  function handlePhoto() {

  }

  return (
      <View style={styles.modalContainer}>
       <Camera
        style={styles.cameraStyle}
      />
      </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 12,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.black,
    paddingTop: "10%"
  },
  cameraStyle: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
    marginTop: 340,
  }

});
