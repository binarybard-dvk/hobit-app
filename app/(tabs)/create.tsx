import React, { useEffect, useState } from 'react'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { Controller, useForm } from 'react-hook-form'
import FormInput from '@/components/ui/FormInput'
import { Picker } from '@react-native-picker/picker'
import {
	Alert,
	Platform,
	SafeAreaView,
	ScrollView,
	Switch,
	Text,
	View,
	useColorScheme,
} from 'react-native'
import Button from '@/components/ui/Button'
import { colors } from '@/constants/Colors'
import { Habit } from '@/utils/types'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import { Redirect, router } from 'expo-router'
import DateTimePicker, {
	DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'

export default function CreateScreen() {
	const [session, setSession] = useState<Session | null>(null)
	const [showTimePicker, setShowTimePicker] = useState(false)
	const colorScheme = useColorScheme()
	const {
		control,
		handleSubmit,
		reset,
		getValues,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			name: '',
			description: '',
			planned_time_minutes: '',
			frequency: 'daily',
			notify: false,
			notify_time: new Date(),
		},
	})

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [session])

	// if (!session) {
	// 	return <Redirect href='/sign-in' />
	// }

	const createHabit = async (data: Habit) => {
		try {
			if (!session?.user) throw new Error('No user on the session!')
			const { error } = await supabase.from('habits').insert([
				{
					...data,
					start_date: new Date(),
					user_id: session?.user?.id,
				},
			])

			if (error) {
				throw error
			} else {
				reset()
				router.push('/habits')
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message)
			}
		}
	}

	return (
		<SafeAreaView
			style={{ backgroundColor: colors[colorScheme ?? 'light'].background }}
			className='h-full'>
			<ScrollView>
				<ThemedView className='flex-1 flex-col space-y-2 gap-2 p-3 mt-10 pb-20'>
					<ThemedText className='text-3xl font-pbold'>Create Habit</ThemedText>

					<Controller
						control={control}
						name='name'
						rules={{
							required: { value: true, message: 'Habit name is required' },
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormInput
								handleBlur={onBlur}
								handleChangeText={(value) => onChange(value)}
								value={value}
								label='Habit name'
								error={errors.name?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name='description'
						render={({ field: { onChange, onBlur, value } }) => (
							<FormInput
								handleBlur={onBlur}
								handleChangeText={(value) => onChange(value)}
								value={value}
								label='Description'
								placeholder='A short and sweet description'
								error={errors.description?.message}
							/>
						)}
					/>

					<Text
						style={{ color: colors[colorScheme ?? 'light'].tabIconDefault }}
						className='text-base'>
						Select frequency
					</Text>
					<Controller
						control={control}
						name='frequency'
						rules={{ required: 'Frequency is required' }}
						render={({ field: { onChange, value } }) => (
							<Picker
								selectedValue={value}
								onValueChange={(itemValue) => onChange(itemValue)}>
								<Picker.Item label='Daily' value='daily' />
								<Picker.Item label='Weekly' value='weekly' />
								<Picker.Item label='Monthly' value='monthly' />
							</Picker>
						)}
					/>

					<Controller
						control={control}
						name='planned_time_minutes'
						rules={{
							required: { value: true, message: 'Planned time is required' },
							pattern: {
								value: /^[0-9]*$/,
								message: 'Planned time must be a number',
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormInput
								handleBlur={onBlur}
								handleChangeText={(value) => onChange(value)}
								value={value}
								label='Planned time (minutes)'
								keyboardType='numeric'
							/>
						)}
					/>

					<View className='flex flex-row p-4 items-center'>
						<Text
							style={{ color: colors[colorScheme ?? 'light'].tabIconDefault }}
							className='text-base mr-4'>
							Enable Notifications
						</Text>
						<Controller
							control={control}
							name='notify'
							render={({ field: { onChange, value } }) => (
								<Switch
									value={value}
									trackColor={{ true: '#84cc16', false: '#ccc' }}
									onValueChange={(value) => onChange(value)}
								/>
							)}
						/>
					</View>

					{getValues('notify') && (
						<View className='flex px-4'>
							<Text
								style={{ color: colors[colorScheme ?? 'light'].tabIconDefault }}
								className='text-base'>
								Notification Time
							</Text>
							<View className='flex flex-row gap-4 items-center p-4'>
								<Button
									title={'8 AM'}
									containerStyles={`mt-4 mr-4 ${
										!showTimePicker
											? ''
											: 'bg-transparent border border-lime-500'
									}`}
									textStyles={!showTimePicker ? '' : 'text-lime-500'}
									handlePress={() => {
										setValue(
											'notify_time',
											new Date(new Date().setHours(8, 0, 0, 0))
										)
									}}
								/>
								<Button
									title='Pick time'
									containerStyles={`mt-4 ${
										showTimePicker
											? ''
											: 'bg-transparent border border-lime-500'
									}`}
									textStyles={showTimePicker ? '' : 'text-lime-500'}
									handlePress={() => setShowTimePicker(true)}
								/>

								{showTimePicker && (
									<Controller
										control={control}
										name='notify_time'
										render={({ field: { onChange, value } }) => (
											<DateTimePicker
												value={new Date(value)}
												mode='time'
												is24Hour={true}
												display='default'
												onChange={(value) => onChange(value)}
											/>
										)}
									/>
								)}
							</View>
						</View>
					)}
					<View className='w-full space-y-2 px-4 mt-5'>
						<Button
							title={isSubmitting ? 'Creating...' : 'Create Habit'}
							handlePress={handleSubmit(createHabit)}
							loading={isSubmitting}
						/>
					</View>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	)
}
