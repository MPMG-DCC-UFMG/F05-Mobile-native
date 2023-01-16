import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import storeUserData from "../auth/storeUserData";
import useAuth from "../auth/useAuth";
import ActivityIndicatior from "../components/ActivityIndicatior";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import ButtonSecondary from "../components/ButtonSecondary";
import Icon, { IconProps } from "../components/Icon";

import ListItemNotification from "../components/ListItemNotification";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { SessionContext } from "../context/SessionContext";
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
    const { notification, comments, loading, error } = useContext(SessionContext);
    const [picture, setPicture] = useState("");
    const [name, setName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [textModal, setTextModal] = useState("");
    const [sendComments, setSendComments] = useState("");
    const [filterComments, setFilterComments] = useState([])

    async function restoreUserData() {
        const response = await storeUserData.getUser();
        setPicture(response.picture);
        setName(response.full_name);
    }

    let filteredNotifications = notification.filter((notification: any) => {
        return notification.user_email === user.email;
    });


    async function handleModal(id: string, title: string, text: string) {

        let filteredComments = comments.filter((comments: any) => {
            return comments.notification_id === id;
        });

        setFilterComments(filteredComments)
        setTitleModal(title)
        setTextModal(text)
        setModalVisible(true)
        setSendComments("")
    }


    function onKnowMoreButtonPressed() {
        Alert.alert(
            "Notificações",
            "Nenhuma solicitação ou notificação foi enviada para seu usuário",
            [
                {
                    text: "Ok",
                    onPress: () => { },
                },
            ],
            { cancelable: true }
        );
    }

    console.log(filterComments)

    useEffect(() => {
        restoreUserData();
    }, []);

    return (
        <>
            <ActivityIndicatior visible={loading} />
            <Screen style={styles.screen}>
                <View style={styles.list}>
                    {error && (
                        <>
                            <AppText>Não foi possível carregar as vistorias.</AppText>
                            <AppButton
                                title="Tentar Novamente"
                            //onPress={loadInspections}
                            ></AppButton>
                        </>
                    )}
                    <FlatList
                        data={filteredNotifications}
                        keyExtractor={(menuItem) => menuItem.id}
                        ItemSeparatorComponent={ListItemSeparator}
                        renderItem={({ item }) => {
                            return <ListItemNotification
                                title={item.title}
                                subTitle={item.content}
                                onPress={() => handleModal(item.inspection_id, item.title, item.content)}
                            />
                        }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListEmptyComponent={
                            <View style={styles.emptyListContainer}>
                                <AppText style={{ color: colors.gray[100], padding: 12 }}>
                                    Não há notificações para esse usuário.
                                </AppText>
                                <ButtonSecondary
                                    color={colors.gray[800]}
                                    title="Saiba mais"
                                    onPress={() => {
                                        onKnowMoreButtonPressed();
                                    }}
                                ></ButtonSecondary>
                            </View>
                        }
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

                    {
                        filterComments.length !== 0 ?
                            <>
                                <FlatList
                                    style={{ width: "100%", height: 250 }}
                                    data={filterComments}
                                    keyExtractor={(menuItem) => menuItem.id}
                                    renderItem={({ item }) => (
                                        <>  
                                            {
                                                item.receive_email === user.email ?
                                                    <View style={styles.chat_receive}>
                                                        <Text style={styles.chat_text}>{item.content}</Text>
                                                    </View>  : null   
                                            }
                                            {
                                                item.send_email !== user.email ?
                                                    <View style={styles.chat_send}>
                                                        <Text style={styles.chat_text}>{item.content}</Text>
                                                    </View>: null     
                                            }
                                        </>
                                    )}
                                />

                                <AppTextInput
                                    maxLength={255}
                                    name="comments"
                                    multiline
                                    autoCorrect={false}
                                    placeholder="Responder solicitação"
                                    onChangeText={setSendComments}
                                    value={sendComments}
                                />
                            </> : null
                    }


                    <View style={styles.closeContainer}>

                        {
                            filterComments.length === 0 ?
                                <TouchableOpacity>
                                    <Icon
                                        name={"trash-can-outline"}
                                        backgroundColor={colors.danger}
                                        size={45}
                                    />
                                </TouchableOpacity> : null
                        }
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                            <Icon
                                name={"close"}
                                backgroundColor={colors.medium}
                                size={45}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Icon
                                name={"send"}
                                backgroundColor={colors.facebookBlue}
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
    emptyListContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
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
    chat_receive: {
        width: "80%",
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "flex-start",
        backgroundColor: colors.gray[600],
        borderRadius: 10,
        marginBottom: 20
    },
    chat_send: {
        width: "80%",
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "flex-end",
        borderRadius: 10,
        backgroundColor: colors.facebookBlue,
        marginBottom: 20
    },
    chat_text: {
        color: colors.gray[200],
        fontWeight: "400",
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
        lineHeight: 23,
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
