import { createStackNavigator } from "@react-navigation/stack";

import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ListingsScreen from "../screens/ListingsScreen";
import PublicWorkCollectsScreen from "../screens/PublicWorkCollectsScreen";
import PublicWorksScreen from "../screens/PublicWorksScreen";
import routes from "./routes";
import CollectEditScreen from "../screens/CollectEditScreen";
import GetPhotoScreen from "../screens/GetPhotoScreen";
import GetPhotoScreen2 from "../screens/GetPhotoScreen2";
import InspectionsScreen from "../screens/InspectionsScreen";
import InspectionCollectEditScreen from "../screens/InspectionCollectEditScreen";
import colors from "../config/colors";
import TrenaVideoInput  from "../components/TrenaVideoInput";

const Stack = createStackNavigator();
export default function InspectionsNavigator() {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerTintColor: colors.white,
        headerTransparent: true,
        headerTitleAlign: "center"
      }}
      // screenOptions={{
      //   headerShown: false,
      // }}
    >
      <Stack.Screen name={routes.INSPECTIONS} component={InspectionsScreen} />
      <Stack.Screen
        name={routes.INSPECTION_COLLECT_EDIT}
        component={InspectionCollectEditScreen}
      />
      <Stack.Screen
        name={routes.GET_VIDEO}
        component={TrenaVideoInput}
      />
      {/* <Stack.Screen
        name={routes.PUBLIC_WORK_COLLECTS}
        component={PublicWorkCollectsScreen}
      />
      <Stack.Screen name={routes.GET_PHOTO} component={GetPhotoScreen2} /> */}
    </Stack.Navigator>
  );
}
