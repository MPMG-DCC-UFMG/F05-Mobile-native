import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import routes from "./routes";

const Stack = createStackNavigator();
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.white,
        headerTransparent: true
      }}
    >
      <Stack.Screen
        name={routes.WELCOME}
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name={routes.LOGIN} component={LoginScreen} /> */}
      <Stack.Screen name={routes.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  );
}
