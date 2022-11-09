import { createStackNavigator } from "@react-navigation/stack";

import PublicWorkCollectsScreen from "../screens/PublicWorkCollectsScreen";
import PublicWorksScreen from "../screens/PublicWorksScreen";
import routes from "./routes";
import colors from "../config/colors";
import PublicWorkCollectEditScreen from "../screens/PublicWorkCollectEditScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
export default function PublicWorksNavigator() {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerTintColor: colors.white,
        headerTransparent: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name={routes.PUBLIC_WORKS}
        component={PublicWorksScreen}
        // options={{
        //   headerRight: () => (
        //     <MaterialCommunityIcons
        //       onPress={() => alert("A desenvolver!")}
        //       name="filter-outline"
        //       size={32}
        //     />
        //   ),
        // }}
      />
      <Stack.Screen
        name={routes.PUBLIC_WORK_COLLECTS}
        component={PublicWorkCollectsScreen}
      />
      <Stack.Screen
        name={routes.COLLECT_EDIT}
        component={PublicWorkCollectEditScreen}
      />
    </Stack.Navigator>
  );
}
