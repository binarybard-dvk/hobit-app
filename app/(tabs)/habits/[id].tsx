import React from "react";
import {
  View,
  Text,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import Button from "@/components/ui/Button";
import { formatRelative } from "date-fns";
import icons from "@/constants/icons";
import { useQuery } from "@tanstack/react-query";
import { getHabitActivity } from "@/utils/actions";

export default function HabitScreen() {
  const { id, name, description, frequency, planned_time, notify } =
    useLocalSearchParams();
  const colorScheme = useColorScheme();

  const {
    data: activity,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["habit_entries", id],
    queryFn: () => getHabitActivity(id?.toString() ?? ""),
  });

  return (
    <SafeAreaView
      style={{ backgroundColor: colors[colorScheme ?? "light"].background }}
      className="h-full"
    >
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <ThemedView className="flex-1">
          <View>
            <View
              className={`relative flex flex-col py-10 my-10 items-center justify-center ${
                colorScheme === "light" ? "bg-neutral-100" : "bg-neutral-800"
              }`}
            >
              {notify === "true" ? (
                <View className="absolute top-4 right-4">
                  <Image
                    source={icons.notification}
                    resizeMode="contain"
                    tintColor={colors[colorScheme ?? "light"].tint}
                    className="w-6 h-6 rotate-45 opacity-80"
                  />
                </View>
              ) : null}
              <ThemedText className="text-3xl font-pbold">{name}</ThemedText>
              <ThemedText className="font-pregular">{description}</ThemedText>
              <ThemedText
                style={{ color: colors[colorScheme ?? "light"].tabIconDefault }}
                className="font-pitalic text-sm"
              >
                You planned this {frequency} for{" "}
                <Text className="text-lime-500">{planned_time}</Text> minutes.
              </ThemedText>
            </View>
            <View className="flex flex-col space-y-2 px-4">
              <View className="flex flex-row items-center justify-between mb-4">
                <ThemedText className="text-xl font-pbold">
                  Recent activity
                </ThemedText>
                <Button
                  title="Track"
                  handlePress={() =>
                    router.push(
                      `/habits/track?id=${id}&name=${name}&frequency=${frequency}&planned_time=${planned_time}&to=${id}`,
                    )
                  }
                />
              </View>
              {isLoading ? (
                <View className="mt-10">
                  <ActivityIndicator
                    animating={isLoading}
                    color="#84cc16"
                    size="large"
                  />
                </View>
              ) : isError ? (
                <ThemedText className="text-lg text-center opacity-30 font-pbold">
                  {error.message}
                </ThemedText>
              ) : activity?.length === 0 ? (
                <ThemedText className="text-lg text-center opacity-30 font-pbold">
                  No activity yet
                </ThemedText>
              ) : (
                activity?.map((entry) => (
                  <ThemedView
                    key={entry.entry_date}
                    className="flex-row items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <ThemedText className="font-pbold">
                      {entry.status}
                    </ThemedText>

                    <ThemedText className="font-pregular">
                      {entry?.entry_date
                        ? formatRelative(new Date(entry.entry_date), new Date())
                        : ""}
                    </ThemedText>
                  </ThemedView>
                ))
              )}
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
