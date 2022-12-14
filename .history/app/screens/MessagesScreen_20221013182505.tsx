import React from "react";
import { FlatList, View } from "react-native";

import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";

const messages = [
  {
    id: 1,
    title: "T1",
    description: "D1",
    image: require("../assets/george.jpeg"),
  },
  {
    id: 2,
    title: "T2",
    description: "D2",
    image: require("../assets/george.jpeg"),
  },
];

export default function MessagesScreen(props: any) {
  return (
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => console.log("Message selected", item)}
            renderRightActions={() => (
              <View style={{ backgroundColor: "red", width: 70 }}></View>
            )}
          ></ListItem>
        )}
        ItemSeparatorComponent={(props) => <ListItemSeparator />}
      ></FlatList>
    </Screen>
  );
}

// const styles = StyleSheet.create({
//   screen: {
//     paddingTop: Constants.statusBarHeight,
//   },
// });
