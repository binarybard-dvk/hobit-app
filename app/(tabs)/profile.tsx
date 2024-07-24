import { useState } from "react";
import { View, SafeAreaView, ScrollView, useColorScheme } from "react-native";
import { supabase } from "@/utils/supabase";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import { getProfile, updateProfile } from "@/utils/actions";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  // const [avatarUrl, setAvatarUrl] = useState('')
  const colorScheme = useColorScheme();
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await getProfile();
      setUsername(data.username);
      setWebsite(data.website);
      return data;
    },
  });
  const mutation = useMutation({
    mutationFn: updateProfile,
  });

  return (
    <SafeAreaView
      style={{ backgroundColor: colors[colorScheme ?? "light"].background }}
      className="h-full"
    >
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <ThemedView className="flex flex-col space-y-2 p-3 mt-10">
          <ThemedText className="text-3xl font-pbold px-4 mb-4">
            Update Profile
          </ThemedText>
          <FormInput
            label="Email"
            value={profile?.email ?? ""}
            disabled={true}
          />
          <FormInput
            label="Username"
            value={username ?? ""}
            handleChangeText={(text) => setUsername(text)}
            disabled={isLoading || isError}
          />
          <FormInput
            label="Website"
            value={website ?? ""}
            handleChangeText={(text) => setWebsite(text)}
            disabled={isLoading || isError}
          />

          <View className="w-full space-y-2 p-4 mt-5">
            <Button
              title={
                isLoading
                  ? "Fetching..."
                  : mutation.isPending
                    ? "Updating..."
                    : "Update"
              }
              handlePress={() =>
                mutation.mutate({ username, website, avatar_url: "" })
              }
              loading={mutation.isPending || isLoading}
            />

            <Button
              containerStyles={"bg-red-500 mt-5"}
              title="Sign Out"
              handlePress={async () => {
								console.log('signing out...')
								await supabase.auth.signOut()
								router.push('/')
							}}
            />
          </View>
          {/* <Push /> */}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
