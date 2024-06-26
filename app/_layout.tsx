import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
// import * as Notifications from "expo-notifications";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/Colors";
import { Platform } from "react-native";
// import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
  //   [],
  // );
  // const [notification, setNotification] = useState<
  //   Notifications.Notification | undefined
  // >(undefined);
  // const notificationListener = useRef<Notifications.Subscription>();
  // const responseListener = useRef<Notifications.Subscription>();

  // useEffect(() => {
  // 	registerForPushNotificationsAsync().then(
  // 		(token) => token && setExpoPushToken(token)
  // 	)

  // 	if (Platform.OS === 'android') {
  // 		Notifications.getNotificationChannelsAsync().then((value) =>
  // 			setChannels(value ?? [])
  // 		)
  // 	}
  // 	notificationListener.current =
  // 		Notifications.addNotificationReceivedListener((notification) => {
  // 			setNotification(notification)
  // 		})

  // 	responseListener.current =
  // 		Notifications.addNotificationResponseReceivedListener((response) => {
  // 			console.log(response)
  // 		})

  // 	return () => {
  // 		notificationListener.current &&
  // 			Notifications.removeNotificationSubscription(
  // 				notificationListener.current
  // 			)
  // 		responseListener.current &&
  // 			Notifications.removeNotificationSubscription(responseListener.current)
  // 	}
  // }, [])

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>

        <StatusBar
          backgroundColor={colors[colorScheme ?? "light"].background}
          style={colorScheme === "light" ? "dark" : "light"}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
