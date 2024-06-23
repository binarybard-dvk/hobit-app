import React from "react";
import { colors } from "@/constants/Colors";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
} from "react-native";

type ButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: any;
  textStyles?: any;
  loading?: boolean;
  children?: React.ReactNode;
};

export default function Button({
  title,
  handlePress,
  containerStyles,
  textStyles,
  loading,
  children,
}: ButtonProps) {
  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      className={`rounded-xl h-16 py-3 px-6 flex flex-row items-center justify-center bg-lime-500 ${containerStyles} ${
        loading ? "opacity-80" : ""
      }`}
    >
      {children}
      <Text
        className={`text-white font-semibold font-psemibold text-lg ${textStyles}`}
      >
        {title}
      </Text>

      {loading && (
        <ActivityIndicator
          animating={loading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </Pressable>
  );
}
