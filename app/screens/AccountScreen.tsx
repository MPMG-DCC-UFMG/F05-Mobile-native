import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import storeUserData from "../auth/storeUserData";
import useAuth from "../auth/useAuth";
import ActivityIndicatior from "../components/ActivityIndicatior";
import Icon, { IconProps } from "../components/Icon";

import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { SessionContext } from "../context/SessionContext";
import routes from "../navigation/routes";

interface MenuItem {
  title: string;
  icon: IconProps;
  targetScreen?: string;
}

const menuItems: MenuItem[] = [
  // {
  //   title: "My Listings",
  //   icon: { name: "format-list-bulleted", backgroundColor: colors.primary },
  // },
  // {
  //   title: "My Messages",
  //   icon: { name: "email", backgroundColor: colors.secondary },
  //   targetScreen: routes.MESSAGES,
  // },
];

export default function AccountScreen({ navigation }: any) {
  const { user, logOut } = useAuth();
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");

  async function restoreUserData() {
    const response = await storeUserData.getUser();
    console.log(response);
    setPicture(response.picture);
    setName(response.full_name);
  }

  useEffect(() => {
    restoreUserData();
  }, []);

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        {picture !== "" ? (
          <ListItem
            title={name}
            subTitle={user.email}
            image={{ uri: picture }}
          ></ListItem>
        ) : (
          <ListItem
            title={name}
            subTitle={user.email}
            IconComponent={
              <Icon name={"account"} backgroundColor={colors.medium}></Icon>
            }
          ></ListItem>
        )}
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => {
            return item.title === "My Messages" ? (
              <ListItem
                title={item.title}
                IconComponent={
                  <Icon
                    name={item.icon.name}
                    backgroundColor={item.icon.backgroundColor}
                  ></Icon>
                }
                onPress={() => navigation.navigate(item.targetScreen)}
              ></ListItem>
            ) : (
              <ListItem
                title={item.title}
                IconComponent={
                  <Icon
                    name={item.icon.name}
                    backgroundColor={item.icon.backgroundColor}
                  ></Icon>
                }
              ></ListItem>
            );
          }}
        ></FlatList>
      </View>
      <ListItem
        title="Log Out"
        IconComponent={
          <Icon
            name="logout"
            color={colors.dark}
            backgroundColor={colors.trenaGreen}
          ></Icon>
        }
        onPress={() => logOut()}
      ></ListItem>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "20%",
    backgroundColor: colors.white,
  },
  screen: {
    backgroundColor: colors.dark,
  },
});
