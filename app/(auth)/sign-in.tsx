import {
  Image,
  ScrollView,
  useColorScheme,
  Alert,
  View,
  Text,
} from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";
import logo from "@/assets/images/logo.png";
import { User } from "@/utils/types";
import { supabase } from "@/utils/supabase";
import FormInput from "@/components/ui/FormInput";
import { Link, router } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import icons from "@/constants/icons";

WebBrowser.maybeCompleteAuthSession(); // required for web only
export const homeLink = makeRedirectUri();
console.log("url: ", homeLink);

export const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    defaultValues: {
      email: "",
      // password: '',
    },
  });

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  const githubLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: homeLink,
        skipBrowserRedirect: true,
      },
    });
    if (error) Alert.alert(error.message);

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      homeLink,
    );

    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
      router.push("/habits");
    }
  };

  const emailLogin = async (data: User) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: homeLink,
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
            Start Tracking!
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
                containerStyles={"h-16"}
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />
          {/* <Controller
						name='password'
						control={control}
						rules={{
							required: {
								value: true,
								message: 'Password is required',
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormInput
								label='Password'
								handleBlur={onBlur}
								handleChangeText={(value) => onChange(value)}
								value={value}
								error={errors.password?.message}
							/>
						)}
					/> */}

          <Button
            containerStyles={"my-7 px-4 h-16 w-[90%]"}
            textStyles={"text-xl"}
            title="Continue with Email"
            handlePress={handleSubmit(emailLogin)}
            loading={isLoading}
          />

          {/* <View className='justify-center items-center mt-4'>
						<ThemedText className='font-pregular'>
							Don't have an account?{' '}
							<Link className='text-lime-500 font-pmedium' href='/sign-up'>
								Sign up
							</Link>
						</ThemedText>
					</View> */}
          <Text className="text-neutral-500">- Or -</Text>
          <Button
            containerStyles={"mt-7 px-4 h-16 w-[90%]"}
            textStyles={"text-xl"}
            title="Continue with GitHub"
            handlePress={githubLogin}
            loading={isLoading}
          >
            <Image
              className="mr-3"
              source={icons.github}
              resizeMode="contain"
            />
          </Button>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
