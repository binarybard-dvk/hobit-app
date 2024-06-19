import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  useColorScheme,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { Habit } from "@/utils/types";
import { colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";

export default function HabitScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (id) {
      getHabit();
    }
  }, [id]);

  async function getHabit() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("habits")
        .select(`name, description, frequency, planned_time_minutes`)
        .eq("id", id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setHabit(data);
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
        <ThemedView className="flex-1 justify-center items-center">
          <ThemedText className="text-3xl font-pbold">{habit?.name}</ThemedText>
          <ThemedText className="font-pregular">
            {habit?.description}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
