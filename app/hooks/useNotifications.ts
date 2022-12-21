import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

import expoPushTokensApi from "../api/expoPushTokens";
import navigation from "../navigation/rootNavigation";
import { Platform } from "react-native";

export default function useNotifications(notificationListener?: any) {
  const [notificationOn, setNotificationOn] = useState(true)
  const [notification, setNotification] = useState<Notifications.Notification>()
  

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: notificationOn,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })

  //Local function notification 
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    })
  }


  useEffect(() => {
    registerForPushNotifications();

    if (notificationListener)
      Notifications.addNotificationReceivedListener(notificationListener);
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) return;

      const token = await Notifications.getExpoPushTokenAsync();
      expoPushTokensApi.register(token.data);


      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        })
      }
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };
}