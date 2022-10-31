import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import routes from "./routes";

const Stack = createStackNavigator();
export default function AccountNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.white,
        headerTransparent: true
      }}
    >
      <Stack.Screen
      
        name={routes.ACCOUNT}
        component={AccountScreen}
        // options={{
        //   headerShown: false,
        // }}
      />
      <Stack.Screen name={routes.MESSAGES} component={MessagesScreen} />
    </Stack.Navigator>
  );
}
