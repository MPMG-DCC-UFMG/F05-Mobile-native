import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity, Switch } from "react-native";
import storeUserData from "../auth/storeUserData";
import useAuth from "../auth/useAuth";
import Icon, { IconProps } from "../components/Icon";

import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import routes from "../navigation/routes";

interface MenuItem {
  title: string;
  icon: IconProps;
  targetScreen?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Notificações",
    icon: { name: "message-text", backgroundColor: colors.secondary },
    targetScreen: routes.MESSAGES
  },
  {
    title: "Tema",
    icon: { name: "theme-light-dark", backgroundColor: colors.medium },
  },
];

export default function AccountScreen({ navigation }: any) {
  const { user, logOut } = useAuth();
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");

  async function restoreUserData() {
    const response = await storeUserData.getUser();
    setPicture(response.picture);
    setName(response.full_name);
  }

  useEffect(() => {
    restoreUserData();
    setPicture("");
    setName("");

  }, []);

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          {picture !== "" ?
            <Image style={styles.image} source={{ uri: picture }} />
            :
            <Icon name={"account"} size={120} backgroundColor={colors.medium} />
          }
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subTitle}>{user.email}</Text>
        </View>
      </View>
      <View style={styles.list}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => {
            return item.title === "Notificações" ? (
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
                switchTheme={item.title === "Tema" ? true : false}
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

      <TouchableOpacity style={styles.btnLogout} onPress={logOut}>
        <Icon
          name="logout"
          color={colors.dark}
          backgroundColor={colors.red[500]}
          size={35}
        />
        <Text style={[styles.subTitle, { marginLeft: 10 }]}>Logout</Text>
      </TouchableOpacity>

    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "20%",
  },
  screen: {
    backgroundColor: colors.dark,
  },
  photoContainer: {
    alignItems: "center"
  },
  image: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: colors.trenaGreen,
    borderRadius: 64
  },
  title: {
    marginTop: 10,
    fontWeight: "500",
    color: colors.gray[100],
    fontSize: 22
  },
  subTitle: {
    marginTop: 3,
    fontWeight: "400",
    color: colors.gray[100],
    fontSize: 18
  },
  list: {
    marginTop: 25,
  },
  btnLogout: {
    width: "60%",
    alignSelf: "center",
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.trenaGreen,
    bottom: 20
  }
});
