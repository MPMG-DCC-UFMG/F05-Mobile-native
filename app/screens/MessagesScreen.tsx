import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
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
        title: "My Messages",
        icon: { name: "message-text", backgroundColor: colors.secondary },
        targetScreen: routes.MESSAGES
    },
    {
        title: "Tema",
        icon: { name: "theme-light-dark", backgroundColor: colors.medium },
    },
];

export default function MessagesScreen({ navigation }: any) {
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
    }, []);

    return (
        <Screen style={styles.screen}>
            
            <View style={styles.list}>
                {/* <FlatList
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
                /> */}
            </View>

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
    list: {
        marginTop: 25,
    },

});
