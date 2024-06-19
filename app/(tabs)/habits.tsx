import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
  View,
} from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";
import { Link, Redirect, router } from "expo-router";
import { Habit } from "@/utils/types";

export default function HabitsScreen() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      getHabits();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [session]);

  // if (!session) {
  // 	return <Redirect href='/sign-in' />
  // }

  async function getHabits() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("habits")
        .select(`id, name, description`)
        .eq("user_id", session?.user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setHabits(data as Habit[]);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: colors[colorScheme ?? "light"].background }}
      className="h-full"
    >
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <ThemedView className="flex-1 flex-col space-y-2 px-4">
          <ThemedText className="text-3xl font-pbold mt-10">
            Welcome back!
          </ThemedText>

          <ThemedText className="text-xl font-pbold mt-7">
            Your habits:
          </ThemedText>
          <View className="space-y-2">
            {habits.map((habit) => (
              <ThemedView
                key={habit.name}
                className="flex-row items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <ThemedText className="font-pbold">{habit.name}</ThemedText>
                <Link className="text-lime-500" href={`/habits/${habit.id}`}>
                  View
                </Link>
              </ThemedView>
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
