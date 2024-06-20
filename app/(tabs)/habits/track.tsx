import Button from '@/components/ui/Button'
import FormInput from '@/components/ui/FormInput'
import { ThemedView } from '@/components/ui/ThemedView'
import { colors } from '@/constants/Colors'
import { supabase } from '@/utils/supabase'
import { Picker } from '@react-native-picker/picker'
import { Link, router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, useColorScheme, Alert } from 'react-native'

export default function TrackScreen() {
	const colorScheme = useColorScheme()
	const { id, name, planned_time, frequency, to } = useLocalSearchParams()
	const isPresented = router.canGoBack()
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			status: 'Completed',
			actual_time_minutes: planned_time?.toString() || '',
		},
	})

	const trackHabit = async (formData: any) => {
		try {
			const { error } = await supabase.from('habit_entries').insert([
				{
					habit_id: id,
					...formData,
					entry_date: new Date(),
				},
			])

			if (error) {
				console.error('Error adding habit entry:', error)
				throw error
			} else {
				reset()
				router.push(`../`)
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message)
			}
		}
	}

	return (
		<ThemedView className='h-full'>
			<Text className='h-16 bg-lime-500 text-white font-psemibold text-xl py-4 text-center'>
				Track: {name}
			</Text>
			<ThemedView className='flex flex-col space-y-2 gap-2 p-3 mt-5'>
				<Text
					className='text-base font-pitalic mb-4'
					style={{ color: colors[colorScheme ?? 'light'].tabIconDefault }}>
					You planned to {name}{' '}
					<Text className='text-lime-600'>{planned_time}</Text> minutes{' '}
					{frequency}
				</Text>
				<Text
					style={{ color: colors[colorScheme ?? 'light'].tabIconDefault }}
					className='text-base'>
					Select status
				</Text>
				<Controller
					control={control}
					name='status'
					rules={{ required: 'Status is required' }}
					render={({ field: { onChange, value } }) => (
						<Picker
							selectedValue={value}
							onValueChange={(itemValue) => onChange(itemValue)}>
							<Picker.Item label='Completed' value='Completed' />
							<Picker.Item label='Missed' value='Missed' />
							<Picker.Item label='Skipped' value='Skipped' />
						</Picker>
					)}
				/>
				{errors.status && (
					<Text className='text-red-500 px-4'>{errors.status.message}</Text>
				)}
				<Controller
					control={control}
					name='actual_time_minutes'
					render={({ field: { onChange, onBlur, value } }) => (
						<FormInput
							handleBlur={onBlur}
							handleChangeText={(value) => onChange(value)}
							value={value}
							label='Actaul time (minutes)'
							placeholder='Enter actual time spent'
							keyboardType='numeric'
						/>
					)}
				/>
				{errors.actual_time_minutes && (
					<Text className='text-red-500 px-4'>
						{errors.actual_time_minutes.message}
					</Text>
				)}

				<View className='flex gap-4 px-4'>
					<Button
						containerStyles={'mt-10'}
						title={isSubmitting ? 'Adding...' : 'Track Habit'}
						handlePress={handleSubmit(trackHabit)}
						loading={isSubmitting}
					/>

					<Button
						containerStyles={'mt-4'}
						title={'Dismiss'}
						handlePress={() => router.push(`../`)}
					/>
				</View>
			</ThemedView>
		</ThemedView>
	)
}
