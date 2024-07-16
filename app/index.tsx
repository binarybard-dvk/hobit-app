import { Image, Platform, ScrollView } from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";
import logo from "../assets/images/logo.png";
import { Redirect, router } from "expo-router";
import * as Linking from "expo-linking";
import { createSessionFromUrl } from "./(auth)/sign-in";

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const colorScheme = useColorScheme();
  const path =
    colorScheme === "light"
      ? require("../assets/images/path-light.png")
      : require("../assets/images/path-dark.png");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [session]);

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url).then(res => res && setSession(res))

  if (session && session.user) {
    return <Redirect href="/habits" />;
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: colors[colorScheme ?? "light"].background }}
      className="h-full"
    >
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <ThemedView className="relative flex-1 justify-center items-center">
          <Image source={logo} className="h-[150px]" resizeMode="contain" />
          <ThemedText className="text-5xl font-pbold py-2">Hobit</ThemedText>
          <ThemedText className="text-sm font-regular mb-2">
            Track your stuff without forgetting
          </ThemedText>

          <ThemedText>
            {session && session.user && (
              <ThemedText>{session.user.id}</ThemedText>
            )}
          </ThemedText>

          <Button
            title="Sign in to continue"
            handlePress={() => router.push("/sign-in")}
            containerStyles={"w-[80%] h-16"}
            textStyles={"text-xl"}
          />

          <Image
            source={path}
            className="w-screen absolute -z-10 -bottom-40 left-0 right-0"
            resizeMode="contain"
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
