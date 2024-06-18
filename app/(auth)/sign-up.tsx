import { Image, ScrollView, useColorScheme } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";
import logo from "@/assets/images/logo.png";
import { User } from "@/utils/types";
import { supabase } from "@/utils/supabase";
import FormInput from "@/components/ui/FormInput";
import { Link } from "expo-router";

export default function SignUp() {
  const colorScheme = useColorScheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: User) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password ?? "",
      options: {
        emailRedirectTo: "https://giridhar.pages.dev",
      },
    });

    if (error) Alert.alert(error.message);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors[colorScheme ?? "light"].background }}
      className="h-full"
    >
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <ThemedView className="relative flex-1 justify-center items-center">
          <Image source={logo} className="h-[80px]" resizeMode="contain" />
          <ThemedText className="text-3xl font-pbold my-2">
            Create Account
          </ThemedText>

          <Controller
            name="email"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Email is required",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Email"
                handleBlur={onBlur}
                handleChangeText={(value) => onChange(value)}
                value={value}
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Email is required",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one letter and one number",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Password"
                handleBlur={onBlur}
                handleChangeText={(value) => onChange(value)}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            containerStyles={"mt-7 px-4 h-16 w-[90%]"}
            textStyles={"text-xl"}
            title="Sign Up"
            handlePress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />

          <View className="justify-center items-center mt-4">
            <ThemedText className="font-pregular">
              Already have an account?{" "}
              <Link className="text-lime-500 font-pmedium" href="/sign-in">
                Sign in
              </Link>
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
