import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View, Dimensions, Text } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";


import { SessionContext } from "../context/SessionContext";
import { AppForm, AppFormField, AppFormPicker, ErrorMessage, SubmitButton } from "../components/forms";
import StatusPickerItem from "../components/StatusPickerItem";
import AppPicker from "../components/AppPicker";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("O campo nome da obra é obrigatório"),
    street: Yup.string().required("O campo rua é obrigatório")
});


export default function PublicWorkAddScreen({ navigation, route }: any) {
    const { typeWorks } = useContext(SessionContext);
    const [type, setType] = useState("");
    const [cep, setCep] = useState("");
    const [error, setError] = useState(false);


    const handleSubmit = async ({ name, street, cep }: any) => {



    }

    useEffect(() => {

        if(cep !== "") {
            fetch(`https://ws.apicep.com/cep/${cep}.json`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setError(false)

            })
            .catch(err =>
                setError(true)

            )
        }
        
    }, [cep])




    return (
        <>
            <Screen style={styles.screen}>
                <View
                    style={styles.formView}
                >
                    <AppPicker
                        items={typeWorks}
                        numberOfColumns={1}
                        onSelectItem={(item: any) => {
                            console.log(item);
                            setType(item);
                        }}
                        PickerItemComponent={StatusPickerItem}
                        placeholder="Tipo de obra"
                        width="100%"
                        selectedItem={type}
                    />
                    <AppForm
                        initialValues={{ name: "", rua: "", cep: "" }}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >

                        <AppFormField
                            autoCapitalize="none"
                            autoCorrect={false}
                            caretHidden={false}
                            name="name"
                            placeholder="Nome da obra"
                        />
                        <AppFormField
                            autoCapitalize="none"
                            autoCorrect={false}
                            name="street"
                            placeholder="Rua"
                        />
                        <View style={styles.smallFormView}>
                            <AppFormField
                                autoCapitalize="none"
                                autoCorrect={false}
                                name="cep"
                                width={(windowWidth / 2) - 23}
                                placeholder="CEP"
                                keyboardType='numeric'
                                onChangeText={setCep}
                                value={cep}
                            />
                            <AppFormField
                                autoCapitalize="none"
                                autoCorrect={false}
                                width={(windowWidth / 2) - 23}
                                name="number"
                                placeholder="Número"
                            />
                        </View>
                        <ErrorMessage
                            error="CEP informado é inválido "
                            visible={error}
                        />

                        <AppFormField
                            autoCapitalize="none"
                            autoCorrect={false}
                            name="district"
                            placeholder="Bairro"
                        />
                        <AppFormField
                            autoCapitalize="none"
                            autoCorrect={false}
                            name="city"
                            placeholder="Cidade"
                        />

                        <SubmitButton
                            color={colors.trenaGreen}
                            title="Adicionar obra"
                        />
                    </AppForm>

                </View>

                <AppButton
                    color={colors.danger}
                    title="Validar localização"
                    onPress={() => { }
                    }
                ></AppButton>
            </Screen>
        </>
    );
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        paddingBottom: 0,
        backgroundColor: colors.dark,
    },
    formView: {
        marginTop: "20%",
    },
    smallFormView: {
        flexDirection: "row",
        justifyContent: "space-between"
    }

});
