import React from "react";
import { Stack } from "expo-router";
import { Text } from "react-native";

export default function HabitLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="track"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
