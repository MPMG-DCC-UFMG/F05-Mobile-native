import React, { useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput, TouchableWithoutFeedback } from "react-native";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import Screen from "./Screen";
import ListItemSeparator from "./ListItemSeparator";
import AppButton from "./AppButton";
import colors from "../config/colors";

export default function AppPicker({
  icon,
  items,
  numberOfColumns = 1,
  onSelectItem,
  PickerItemComponent,
  selectedItem,
  placeholder,
  width = "100%",
}: any) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            ></MaterialCommunityIcons>
          )}
          {selectedItem ? (
            <AppText style={styles.text}>{selectedItem.name}</AppText>
          ) : (
            <AppText style={styles.placeholder}>{placeholder}</AppText>
          )}
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={defaultStyles.colors.medium}
          ></MaterialCommunityIcons>
        </View>
      </TouchableOpacity>
      <Modal style={styles.modal} visible={modalVisible} animationType="slide">
        <Screen style={styles.modal}>
          <AppButton
            color={colors.trenaGreen}
            title="Fechar"
            onPress={() => setModalVisible(false)}
          ></AppButton>
          <FlatList
            data={items}
            keyExtractor={(item) => item.name.toString()}
            numColumns={numberOfColumns}
            renderItem={({ item }) => (
              <PickerItemComponent
                item={item}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              ></PickerItemComponent>
            )}
            ItemSeparatorComponent={ListItemSeparator}
          ></FlatList>
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray[800],
    borderRadius: 4,
    flexDirection: "row",
    padding: 12,
    marginVertical: 12,
    alignItems: "center",
    borderColor: colors.trenaGreen,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  placeholder: {
    flex: 1,
    color: colors.gray[300],
  },
  modal: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  text: {
    flex: 1,
    color: colors.gray[100],
  },
});
