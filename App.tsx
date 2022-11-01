import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';

import navigationTheme from "./app/navigation/navigationTheme";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";
import TrenaNavigator from "./app/navigation/TrenaNavigator";
import { SessionProvider } from "./app/context/SessionContext";
import { StatusBar } from "react-native";

// logger.start();

export default function App() {
  const [user, setUser] = useState();
<<<<<<< HEAD
  const [appIsReady, setAppIsReady] = useState(false);
=======
  const [userData, setUserData] = useState();
  const [isReady, setIsReady] = useState(false);
>>>>>>> master

  const restoreUser = async () => {
    const user: any = await authStorage.getUser();
    if (user) setUser(user);
  };


  useEffect(() => {
    async function prepare() {
      try {
        restoreUser()
        // Pre-load fonts, make any API calls you need to do here
        //await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  console.log(user);

  return (
    // <Screen>
    //   <Text>cddsdfdf</Text>
    // </Screen>
<<<<<<< HEAD
    <AuthContext.Provider value={{ user, setUser }}>
      <StatusBar barStyle='light-content' translucent backgroundColor='transparent'/>
=======
    <AuthContext.Provider value={{ user, setUser, userData, setUserData }}>
>>>>>>> master
      <SessionProvider>
        <OfflineNotice />
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          {user ? <TrenaNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </SessionProvider>
    </AuthContext.Provider>
  );
}

//PLAYGROUND - JUST IGNORE IT:

// const showNotification = () => {
//   Notifications.presentNotificationAsync({
//     title: "Congrats",
//     body: "Your order was successfully placed!",
//     data: {
//       _displayInForeground: true,
//     },
//   });
// };

// const demo = async () => {
//   try {
//     await AsyncStorage.setItem(
//       "person",
//       JSON.stringify({ id: 1, name: "George" })
//     );
//     const value = await AsyncStorage.getItem("person");
//     const person = JSON.parse(value as string);
//     console.log(person);
//   } catch (error) {
//     console.log(error);
//   }
// };
// demo();

// NetInfo.fetch().then((netInfo) => console.log(netInfo));
// componentDidMount
// const unsubscribe = NetInfo.addEventListener((netInfo) =>
//   console.log(netInfo)
// );

// // componentWillUmount
// unsubscribe();

// const Link = () => {
//   const navigation = useNavigation();
//   return (
//     <Button
//       title="Click"
//       onPress={() => navigation.navigate("TweetDetails")}
//     ></Button>
//   );
// };

// const Tweets = ({ navigation }: any) => (
//   <Screen>
//     <Text>Tweets</Text>
//     <Button
//       title="View Tweet"
//       onPress={() => navigation.navigate("TweetDetails", { id: 1 })}
//     ></Button>
//   </Screen>
// );

// const TweetDetails = ({ route }: any) => (
//   // useRoute()
//   <Screen>
//     <Text>Tweet details {route.params.id}</Text>
//   </Screen>
// );

// const Stack = createStackNavigator();

// const FeedNavigator = () => (
//   <Stack.Navigator
//     screenOptions={{
//       headerShown: false,
//     }}
//   >
//     <Stack.Screen
//       name="ListingsScreen"
//       component={ListingsScreen}
//     ></Stack.Screen>
//     <Stack.Screen
//       name="ListingDetailsScreen"
//       component={ListingDetailsScreen}
//     ></Stack.Screen>
//   </Stack.Navigator>
// );

// const AccountNavigator = () => (
//   <Stack.Navigator
//     screenOptions={{
//       headerShown: false,
//     }}
//   >
//     <Stack.Screen name="AccountScreen" component={AccountScreen}></Stack.Screen>
//     <Stack.Screen
//       name="MessagesScreen"
//       component={MessagesScreen}
//     ></Stack.Screen>
//   </Stack.Navigator>
// );

// const Account = () => (
//   <Screen>
//     <Text>Account</Text>
//   </Screen>
// );

// const Tab = createBottomTabNavigator();
// const TabNavigator = () => (
//   <Tab.Navigator
//     tabBarOptions={{
//       activeBackgroundColor: "white",
//       activeTintColor: "tomato",
//       inactiveBackgroundColor: "white",
//       inactiveTintColor: colors.medium,
//     }}
//   >
//     <Tab.Screen
//       name="Feed"
//       component={FeedNavigator}
//       options={{
//         tabBarIcon: ({ size, color }) => (
//           <MaterialCommunityIcons name="home" size={size} color={color} />
//         ),
//       }}
//     ></Tab.Screen>
//     <Tab.Screen
//       name="Add"
//       component={ListingEditScreen}
//       options={{
//         tabBarIcon: ({ size, color }) => (
//           <MaterialCommunityIcons
//             name="plus-circle"
//             size={size}
//             color={color}
//           />
//         ),
//       }}
//     ></Tab.Screen>
//     <Tab.Screen
//       name="Account"
//       component={AccountNavigator}
//       options={{
//         tabBarIcon: ({ size, color }) => (
//           <MaterialCommunityIcons name="account" size={size} color={color} />
//         ),
//       }}
//     ></Tab.Screen>
//   </Tab.Navigator>
// );

// const Stack = createStackNavigator();
// const AuthNavigator = () => (
//   <Stack.Navigator
//     screenOptions={{
//       headerShown: false,
//       // headerStyle: { backgroundColor: "dodgerblue" },
//       // headerTintColor: "white",
//     }}
//   >
//     <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}></Stack.Screen>
//     <Stack.Screen name="LoginScreen" component={LoginScreen}></Stack.Screen>
//     <Stack.Screen
//       name="RegisterScreen"
//       component={RegisterScreen}
//     ></Stack.Screen>

//     {/* <Stack.Screen
//       name="TweetDetails"
//       component={TweetDetails}
//       options={{
//         headerStyle: { backgroundColor: "tomato" },
//         headerTintColor: "white",
//         headerShown: false,
//       }}
//       // options={({ route }: any) => ({ title: route.params.id })}
//     ></Stack.Screen> */}
//   </Stack.Navigator>
// );

// const [imageUris, setImageUris] = useState<string[]>([]);

// const handleAdd = (uri: string) => {
//   setImageUris([...imageUris, uri]);
// };

// const handleRemove = (uri: string) => {
//   setImageUris(imageUris.filter((imageUri) => imageUri !== uri));
// };

// const requestPermission = async () => {
//   // const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY, Permissions.LOCATION_BACKGROUND)
//   const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   if (!granted) alert("You need to enable permission to access the library");
// };
{
  /* <Screen>
<ImageInputList
  imageUris={imageUris}
  onAddImage={handleAdd}
  onRemoveImage={handleRemove}
></ImageInputList>
</Screen> */
}

// useEffect(() => {
//   requestPermission();
// }, []);

// const selectImage = async () => {
//   try {
//     const result = await ImagePicker.launchImageLibraryAsync();
//     if (!result.cancelled) setImageUri(result.uri);
//   } catch (error) {
//     console.log("Error reasing an image", error);
//   }
// };

// const categories = [
//   { label: "Furniture", value: 1 },
//   { label: "Clothing", value: 2 },
//   { label: "Cameras", value: 3 },
// ];
{
  /* <Button title="Select image" onPress={selectImage}></Button>
<Image
  source={{ uri: imageUri }}
  style={{ width: 200, height: 200 }}
></Image> */
}

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
