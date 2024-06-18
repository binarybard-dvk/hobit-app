import React, { useEffect, useState } from 'react'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { Controller, useForm } from 'react-hook-form'
import FormInput from '@/components/ui/FormInput'
import { Picker } from '@react-native-picker/picker'
import { SafeAreaView, ScrollView, View, useColorScheme } from 'react-native'
import Button from '@/components/ui/Button'
import { colors } from '@/constants/Colors'
import { Habit } from '@/utils/types'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import { router } from 'expo-router'

export default function Create() {
	const [session, setSession] = useState<Session | null>(null)
	const colorScheme = useColorScheme()
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			name: '',
			description: '',
			planned_time_minutes: '',
			frequency: '',
		},
	})

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	if (!session) {
		router.push('/')
	}

	const onSubmit = async (data: Habit) => {
		console.log(data)
		const { error } = await supabase.from('profiles').insert([
			{
				...data,
				start_date: new Date(),
				user_id: session?.user?.id,
			},
		])
	}

	return (
		<SafeAreaView
			style={{ backgroundColor: colors[colorScheme ?? 'light'].background }}
			className='h-full'>
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<ThemedView className='flex flex-col space-y-2 p-3 mt-10'>
					<ThemedText>Create habit</ThemedText>

					<Controller
						control={control}
						name='name'
						rules={{
							required: { value: true, message: 'Habit name is required' },
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormInput
								handleBlur={onBlur}
								handleChangeText={onChange}
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
								handleChangeText={onChange}
								value={value}
								label='Description'
								placeholder='A short and sweet description'
								error={errors.description?.message}
							/>
						)}
					/>

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
								handleChangeText={onChange}
								value={value}
								label='Planned time (minutes)'
								keyboardType='numeric'
							/>
						)}
					/>

					<View className='w-full space-y-2 px-4 mt-5'>
						<Button
							title={isSubmitting ? 'Creating...' : 'Create Habit'}
							handlePress={handleSubmit(onSubmit)}
							loading={isSubmitting}
						/>
					</View>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	)
}
