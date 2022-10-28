import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
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
}
const menuItems: any = [
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

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        {user.picture ? (
          <ListItem
            title={user.full_name}
            subTitle={user.email}
            image={{ uri: user.picture }}
            // image={require("../assets/george.jpeg")}
          ></ListItem>
        ) : (
          <ListItem
            title={user.full_name}
            subTitle={user.email}
            IconComponent={
              <Icon name={"account"} backgroundColor={colors.light}></Icon>
            }
          ></ListItem>
        )}
        {/* <ListItem
          title={user.full_name}
          subTitle={user.email}
          image={{ uri: user.picture }}
          // image={require("../assets/george.jpeg")}
        ></ListItem> */}
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
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.dark,
  },
});
