import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import InspectionsScreen from "../screens/InspectionsScreen";
import InspectionCollectEditScreen from "../screens/InspectionCollectEditScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();
export default function InspectionsNavigator() {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerTintColor: colors.white,
        headerTransparent: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name={routes.INSPECTIONS} component={InspectionsScreen} />
      <Stack.Screen
        name={routes.INSPECTION_COLLECT_EDIT}
        component={InspectionCollectEditScreen}
      />
    </Stack.Navigator>
  );
}
