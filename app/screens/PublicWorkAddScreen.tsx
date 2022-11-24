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
import publicWorkCollects from "../api/publicWorkCollects";
import useLocation from "../hooks/useLocation";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("O campo nome da obra é obrigatório"),
    street: Yup.string().required("O campo rua é obrigatório"),
    cep: Yup.string().required("O campo cep é obrigatório"),
    number: Yup.string().required("O campo número é obrigatório"),
    district: Yup.string().required("O campo bairro é obrigatório"),
    city: Yup.string().required("O campo cidade é obrigatório"),
});


export default function PublicWorkAddScreen({ navigation, route }: any) {
    const { typeWorks } = useContext(SessionContext);
    const [type, setType] = useState("");
    const [cep, setCep] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(0);
    const { latitude, longitude } = useLocation();

    const handleSubmit = async ({ name, street, cep, number, district, city }, formikBag : any) => {
        setProgress(0);

        let teste = city.split("-")

        const result = await publicWorkCollects.addPublicWorkCollect(
            {
                name: name,
                type_work_flag: type.flag,
                address: {
                    street: street,
                    district: district,
                    number: number,
                    latitude: latitude,
                    longitude: longitude,
                    city: teste[0].replace(" ", ""),
                    state: teste[1].replace(" ", ""),
                    cep: cep,
                },

            },
            
        ) as any

       console.log(result)
    }

    useEffect(() => {

        fetch(`https://ws.apicep.com/cep/${cep}.json`)
            .then(res => res.json())
            .then(data => {
       
                setCity(`${data.city} - ${data.state}`)
                setDistrict(data.district)
                setError(false)

            })
            .catch(err =>
                setError(true)

            )

    }, [cep.length >= 8])


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
                        initialValues={{
                            name: "",
                            street: "",
                            cep: "",
                            number: "",
                            district: "",
                            city: "",
                        }}
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
                                
                            />
                            <AppFormField
                                autoCapitalize="none"
                                autoCorrect={false}
                                width={(windowWidth / 2) - 23}
                                name="number"
                                placeholder="Número"
                            />
                        </View>
                        {/* <ErrorMessage
                            error="CEP informado é inválido "
                            visible={error}
                        /> */}

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
