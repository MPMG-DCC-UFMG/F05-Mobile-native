import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store"
import jwtDecode from "jwt-decode"

const key = "userData";

const storeUser = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.log(e)
  }
}

const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e)
  }
}

export default { getUser, storeUser}
