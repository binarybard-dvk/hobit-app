import React, { useState } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import { Picker } from "@react-native-picker/picker";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/Colors";
import { Habit } from "@/utils/types";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit } from "@/utils/actions";
import { getBasePoints } from "@/utils/points";

export default function CreateScreen() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notify_time, setNotifyTime] = useState(new Date());
  const colorScheme = useColorScheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      planned_time_minutes: "",
      frequency: "daily",
      notify: false,
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createHabit,
    onSuccess: (data) => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      router.push(
        `/habits/${data.id}?name=${data.name}&description=${data.description}&frequency=${data.frequency}&planned_time=${data.planned_time_minutes}&notify=${data.notify}`,
      );
    },
    onError: (error) => {
      console.error("Error creating habit:", error);
      Alert.alert("Error creating habit:", error.message);
    },
  });

  const onCreateTodo = async (formData: Habit) => {
    let points;
    try {
      console.log(process.env.GEMINI_API_KEY);
      points = await getBasePoints(
        formData.name,
        Number(formData.planned_time_minutes),
      );
    } catch (error) {
      points = 15;
    }
    console.log({ points });
    return mutation.mutate({
      ...formData,
      base_points: points ? points / Number(formData.planned_time_minutes) : 0,
      notify_time: formData.notify ? notify_time : null,
      start_date: new Date(),
    });
  };

  const handleTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setNotifyTime(currentDate);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors[colorScheme ?? "light"].background }}
      className="h-full"
    >
      <ScrollView>
        <ThemedView className="flex-1 flex-col space-y-2 gap-2 p-3 mt-10 pb-20">
          <ThemedText className="text-3xl font-pbold">Create Habit</ThemedText>

          <Controller
            control={control}
            name="name"
            rules={{
              required: { value: true, message: "Habit name is required" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                handleBlur={onBlur}
                handleChangeText={(value) => onChange(value)}
                value={value}
                label="Habit name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                handleBlur={onBlur}
                handleChangeText={(value) => onChange(value)}
                value={value}
                label="Description"
                placeholder="A short and sweet description"
                error={errors.description?.message}
              />
            )}
          />

          <View className="mx-4 px-4">
            <Text
              style={{ color: colors[colorScheme ?? "light"].tabIconDefault }}
              className="text-base"
            >
              Select frequency
            </Text>
            <Controller
              control={control}
              name="frequency"
              rules={{ required: "Frequency is required" }}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Picker.Item label="Daily" value="daily" />
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Monthly" value="monthly" />
                </Picker>
              )}
            />
          </View>

          <Controller
            control={control}
            name="planned_time_minutes"
            rules={{
              required: { value: true, message: "Planned time is required" },
              pattern: {
                value: /^[0-9]*$/,
                message: "Planned time must be a number",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                handleBlur={onBlur}
                handleChangeText={(value) => onChange(value)}
                value={value}
                label="Planned time (minutes)"
                keyboardType="numeric"
              />
            )}
          />

          <View className="flex flex-row p-4 items-center">
            <Text
              style={{ color: colors[colorScheme ?? "light"].tabIconDefault }}
              className="text-base mr-4"
            >
              Enable Notifications
            </Text>
            <Controller
              control={control}
              name="notify"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  trackColor={{ true: "#84cc16", false: "#ccc" }}
                  onValueChange={(value) => {
                    onChange(value);
                    setNotify(value);
                  }}
                />
              )}
            />
          </View>

          {notify && (
            <View className="flex px-4">
              <Text
                style={{ color: colors[colorScheme ?? "light"].tabIconDefault }}
                className="text-base"
              >
                Notification Time
              </Text>
              <View className="flex flex-row gap-4 items-center p-4">
                <Button
                  title={"8 AM"}
                  containerStyles={`mt-4 mr-4 ${
                    !showTimePicker
                      ? ""
                      : "bg-transparent border border-lime-500"
                  }`}
                  textStyles={!showTimePicker ? "" : "text-lime-500"}
                  handlePress={() => {
                    setNotifyTime(new Date(new Date().setHours(8, 0, 0, 0)));
                  }}
                />
                <Button
                  title="Pick time"
                  containerStyles={`mt-4 -mr-4 ${
                    showTimePicker
                      ? ""
                      : "bg-transparent border border-lime-500"
                  }`}
                  textStyles={showTimePicker ? "" : "text-lime-500"}
                  handlePress={() => setShowTimePicker(true)}
                />

                {showTimePicker && (
                  <DateTimePicker
                    value={notify_time}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            </View>
          )}
          <View className="w-full space-y-2 px-4 mt-5">
            <Button
              title={mutation.isPending ? "Creating..." : "Create Habit"}
              handlePress={handleSubmit(onCreateTodo)}
              loading={mutation.isPending}
            />
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
