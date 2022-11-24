import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import AccountScreen from "../screens/AccountScreen";
import routes from "./routes";

const Stack = createStackNavigator();
export default function AccountNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.white,
        headerTransparent: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name={routes.ACCOUNT} component={AccountScreen} />
    </Stack.Navigator>
  );
}
