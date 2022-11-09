import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AccountNavigator from "./AccountNavigator";
import routes from "./routes";
import useNotifications from "../hooks/useNotifications";
import PublicWorksNavigator from "./PublicWorksNavigator";
import InspectionsNavigator from "./InspectionsNavigator";
import colors from "../config/colors";
import MapScreen from "../screens/MapScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  useNotifications();

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeBackgroundColor: colors.gray[800],
        inactiveBackgroundColor: colors.gray[800],
        inactiveTintColor: colors.gray[100],
        activeTintColor: colors.trenaGreen,
        style: { borderTopWidth: 0 },
      }}
    >
      <Tab.Screen
        name={routes.INSPECTIONS}
        component={InspectionsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="briefcase-search"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.PUBLIC_WORKS}
        component={PublicWorksNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-hard-hat"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.MAP}
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map-marker-radius"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.ACCOUNT}
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
