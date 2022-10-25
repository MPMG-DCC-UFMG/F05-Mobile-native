import { useEffect, useState } from "react";
import { Button, Image, Switch, Text, TextInput, View } from "react-native";
import AppTextInput from "./app/components/AppTextInput";
import Card from "./app/components/Card";
import Icon from "./app/components/Icon";
import ListItem from "./app/components/ListItem";
import Screen from "./app/components/Screen";
import AccountScreen from "./app/screens/AccountScreen";
import { ListingDetailsScreen } from "./app/screens/ListingDetailsScreen";
import ListingsScreen from "./app/screens/ListingsScreen";
import MessagesScreen from "./app/screens/MessagesScreen";
import MyAccountScreen from "./app/screens/MyAccountScreen";
import ViewImageScreen from "./app/screens/ViewImageScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import { Input } from "@rneui/base";
import AppPicker from "./app/components/AppPicker";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import ListingEditScreen from "./app/screens/ListingEditScreen";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
export interface Category {
  label: string;
  value: number;
}

export default function App() {
  const [imageUri, setImageUri] = useState<string>();
  const requestPermission = async () => {
    // const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY, Permissions.LOCATION_BACKGROUND)
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library");
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) setImageUri(result.uri);
    } catch (error) {
      console.log("Error reasing an image", error);
    }
  };

  return (
    <Screen>
      <ImageInput></ImageInput>
      <Button title="Select image" onPress={selectImage}></Button>
      <Image
        source={{ uri: imageUri }}
        style={{ width: 200, height: 200 }}
      ></Image>
    </Screen>
  );
}

// const categories = [
//   { label: "Furniture", value: 1 },
//   { label: "Clothing", value: 2 },
//   { label: "Cameras", value: 3 },
// ];

// <Screen>
//   <AppPicker
//     selectedItem={category}
//     onSelectItem={(item: Category) => setCategory(item)}
//     items={categories}
//     icon="apps"
//     placeholder="Category"
//   ></AppPicker>
//   <AppTextInput icon="email" placeholder="Email"></AppTextInput>
// </Screen>
// <MyAccountScreen
//   name="George Fonseca"
//   email="george.fons@gmail.com"
//   image={require("./app/assets/george.jpeg")}
// ></MyAccountScreen>
// const [firstName, setFirstName] = useState<string>("");
// const [isNew, setIsNew] = useState<boolean>(false);
{
  /* <Switch value={isNew} onValueChange={(newValue) => setIsNew(newValue)} /> */
}
{
  /* <Input
containerStyle={{}}
disabledInputStyle={{ backgroundColor: "#dddddd" }}
inputContainerStyle={{}}
errorMessage="Oops! that's not correct."
errorStyle={{}}
errorProps={{}}
inputStyle={{}}
label="User Form"
labelStyle={{}}
labelProps={{}}
leftIcon={<Icon name="account-outline" size={20} />}
leftIconContainerStyle={{}}
rightIcon={<Icon name="close" size={20} />}
rightIconContainerStyle={{}}
placeholder="Enter Name"
/> */
}

// <Text>{firstName}</Text>
// <TextInput
//   secureTextEntry
//   // clearButtonMode="always" // iOS only
//   keyboardType="numeric"
//   maxLength={10}
//   onChangeText={(text) => setFirstName(text)}
//   placeholder="First name"
//   style={{ borderBottomColor: "#ccc", borderBottomWidth: 1 }}
// ></TextInput>
// <View style={{ backgroundColor: "#f8f4f4", padding: 20, paddingTop: 100 }}>
//   <Card
//     title="Red jacket for sale"
//     subTitle="$100"
//     image={require("./app/assets/jacket.jpg")}
//   ></Card>
// </View>
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ImageBackground,
//   SafeAreaView,
//   TouchableHighlight,
//   Button,
//   Alert,
//   Platform,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import {
//   useDimensions,
//   useDeviceOrientation,
// } from "@react-native-community/hooks";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//   </View>
{
  /* <AppButton text="LOGIN" color={colors.primary}></AppButton>
      <AppButton text="REGISTER" color={colors.secondary}></AppButton> */
}
{
  /* <AppText>I love React Native!</AppText> */
}
{
  /* <MaterialCommunityIcons
        size={60}
        color="dodgerblue"
        name="email"
      ></MaterialCommunityIcons> */
}
{
  /* <View
        style={{
          backgroundColor: "dodgerblue",
          width: 100,
          height: 100,
          padding: 20,
          paddingHorizontal: 10,
          paddingLeft: 30,
          // borderWidth: 10,
          // borderRadius: 50,
          // borderColor: "royalblue",
          // elevation: 20,
        }}
      >
        <View style={{ backgroundColor: "gold", width: 50, height: 50 }}></View>
      </View>
      <View
        style={{
          backgroundColor: "tomato",
          width: 100,
          height: 100,
          margin: 20,
        }}
      ></View> */
}