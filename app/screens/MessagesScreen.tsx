import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import storeUserData from "../auth/storeUserData";
import useAuth from "../auth/useAuth";
import AppButton from "../components/AppButton";
import Icon, { IconProps } from "../components/Icon";

import ListItemNotification from "../components/ListItemNotification";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useNotifications from "../hooks/useNotifications";
import routes from "../navigation/routes";

interface MenuItem {
    title: string;
    subTitle: string
    icon: IconProps;
    targetScreen?: string;
}

const menuItems: MenuItem[] = [
    {
        title: "Notificação teste APP TERNA",
        subTitle: "Mensagem de teste para verificação do app trenaMensagem de teste para verificação do app trena Mensagem de teste para verificação do app trena ",
        icon: { name: "message-text", backgroundColor: colors.secondary },
        targetScreen: routes.MESSAGES
    }

];

export default function MessagesScreen({ navigation }: any) {
    const { user, logOut } = useAuth();
    const [picture, setPicture] = useState("");
    const [name, setName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [textModal, setTextModal] = useState("");


    async function restoreUserData() {
        const response = await storeUserData.getUser();
        setPicture(response.picture);
        setName(response.full_name);
    }

    function handleModal(title: string, text: string) {
        setTitleModal(title)
        setTextModal(text)
        setModalVisible(true)
    }

    useEffect(() => {
        restoreUserData();
    }, []);

    return (
        <>
            <Screen style={styles.screen}>
                <View style={styles.list}>
                    <FlatList
                        data={menuItems}
                        keyExtractor={(menuItem) => menuItem.title}
                        ItemSeparatorComponent={ListItemSeparator}
                        renderItem={({ item }) => {
                            return <ListItemNotification
                                title={item.title}
                                subTitle={item.subTitle}
                                onPress={() => handleModal(item.title, item.subTitle)}
                            />
                        }}
                    />
                </View>
            </Screen>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modal}>
                    <View style={styles.titleContainer}>
                        <Icon
                            name={"message-text-outline"}
                            backgroundColor={colors.secondary}
                            size={35}
                        />
                        <Text style={styles.titleModal}>{titleModal}</Text>
                    </View>


                    <Text style={styles.subTitleModal}>{textModal}</Text>

                    <View style={styles.closeContainer}>

                    <TouchableOpacity>
                        <Icon
                            name={"trash-can-outline"}
                            backgroundColor={colors.danger}
                            size={45}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                        <Icon
                            name={"close"}
                            backgroundColor={colors.medium}
                            size={45}
                        />
                    </TouchableOpacity>

                    </View>

                   

                    {/* <AppButton
                        style={styles.closeButtonModal}
                        color={colors.trenaGreen}
                        title="Fechar"
                        onPress={() => setModalVisible(!modalVisible)}
                    /> */}
                </View>
            </Modal>
        </>
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
        marginTop: "20%",
    },
    modal: {
        marginTop: "15%",
        alignSelf: "center",
        padding: 20,
        borderColor: colors.trenaGreen,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: colors.dark,
        width: "100%",

        justifyContent: "space-around"
    },
    titleContainer: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: colors.trenaGreen
    },
    subTitleModal: {
        color: colors.gray[200],
        fontWeight: "400",
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: "center",
        lineHeight: 23,
    },
    titleModal: {
        textTransform: "uppercase",
        fontWeight: "600",
        color: colors.gray[100],
        fontSize: 15,
        marginLeft: 15
    },
    closeButtonModal: {
        alignSelf: "flex-end",
    },
    closeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    }

});
