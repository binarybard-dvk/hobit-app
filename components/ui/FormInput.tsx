import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  useColorScheme,
  TextInput,
  Pressable,
} from "react-native";
import { colors } from "@/constants/Colors";
import icons from "@/constants/icons";

type FormInputProps = {
  label: string;
  value: string;
  handleChangeText?: (text: string) => void;
  handleBlur?: () => void;
  otherStyles?: any;
  error?: any;
  disabled?: boolean;
  keyboardType?: string;
};

export default function FormInput({
  label,
  value,
  handleChangeText,
  handleBlur,
  keyboardType,
  otherStyles,
  error,
  disabled,
  ...rest
}: FormInputProps) {
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full space-y-2 px-4 mt-2">
      <Text
        style={{ color: colors[colorScheme ?? "light"].tabIconDefault }}
        className="text-base"
      >
        {label}
      </Text>
      <View
        className={`w-full h-16 px-4 border focus:border-lime-500 rounded-2xl flex-row items-center ${
          colorScheme === "light"
            ? "bg-neutral-100 border-neutral-200"
            : "bg-neutral-800 border-neutral-700"
        }`}
      >
        <TextInput
          className={`flex-1 caret-lime-500 font-pmedium text-base ${
            colorScheme === "light" ? "text-black" : "text-white"
          } ${disabled ? "opacity-50" : ""} ${otherStyles}`}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          value={value}
          editable={!disabled}
          secureTextEntry={label === "Password" && !showPassword}
          {...rest}
        />
        {label === "Password" && (
          <Pressable onPress={() => setShowPassword((prev) => !prev)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </Pressable>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View>
  );
}
