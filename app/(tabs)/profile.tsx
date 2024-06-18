import { useState, useEffect } from "react";
import {
  View,
  Alert,
  SafeAreaView,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { colors } from "@/constants/Colors";

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const colorScheme = useColorScheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (session) getProfile();
  }, []);

  // useEffect(() => {
  // 	if (session) getProfile()
  // }, [session])

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      console.log("user.id: ", session?.user.id);
      console.log("user.email: ", session?.user.email);
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
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
        <ThemedView className="flex flex-col space-y-2 p-3 mt-10">
          <FormInput
            label="Email"
            value={session?.user?.email ?? ""}
            disabled={true}
          />
          <FormInput
            label="Username"
            value={username ?? ""}
            handleChangeText={(text) => setUsername(text)}
          />
          <FormInput
            label="Website"
            value={website ?? ""}
            handleChangeText={(text) => setWebsite(text)}
          />

          <View className="w-full space-y-2 px-4 mt-5">
            <Button
              title={loading ? "Updating..." : "Update"}
              handlePress={() =>
                updateProfile({ username, website, avatar_url: avatarUrl })
              }
              loading={loading}
            />

            <Button
              containerStyles={"bg-red-500 mt-5"}
              title="Sign Out"
              handlePress={() => {
                supabase.auth.signOut();
                router.push("/");
              }}
            />
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
