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
	const { id, name, planned_time, frequency } = useLocalSearchParams()
	const isPresented = router.canGoBack()
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			status: '',
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
				throw error
			} else {
				router.push('/habits')
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
			{!isPresented && <Link href='../'>Dismiss</Link>}
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
							<Picker.Item label='Completed' value='completed' />
							<Picker.Item label='Missed' value='missed' />
							<Picker.Item label='Skipped' value='skipped' />
						</Picker>
					)}
				/>
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

				<Button
					containerStyles={'mt-10 mx-4'}
					title={isSubmitting ? 'Adding...' : 'Track Habit'}
					handlePress={handleSubmit(trackHabit)}
					loading={isSubmitting}
				/>
			</ThemedView>
		</ThemedView>
	)
}
