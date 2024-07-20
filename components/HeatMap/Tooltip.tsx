import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect, G } from "react-native-svg";

type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
};

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
};

export const Tooltip = ({ interactionData, width, height }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <View
      className={`w-[${width}px] h-[${height}] absolute top-0 left-0 pointer-events-none`}
    >
      <View
        style={{ left: interactionData.xPos, top: interactionData.yPos }}
        className={`absolute bg-black bg-opacity-75 p-2 rounded`}
      >
        <TooltipRow label="x" value={interactionData.xLabel} />
        <TooltipRow label="y" value={interactionData.yLabel} />
        <TooltipRow label="value" value={String(interactionData.value)} />
      </View>
    </View>
  );
};

type TooltipRowProps = {
  label: string;
  value: string;
};

const TooltipRow = ({ label, value }: TooltipRowProps) => (
  <View className={`flex-row`}>
    <Text className={`text-white`}>
      <Text className={`font-bold`}>{label}</Text>: {value}
    </Text>
  </View>
);
