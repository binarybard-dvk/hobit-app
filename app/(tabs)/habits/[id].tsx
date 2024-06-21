import React, { useEffect, useState } from 'react'
import {
	View,
	Text,
	Alert,
	useColorScheme,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
	Image,
} from 'react-native'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'
import { Habit, HabitEntry } from '@/utils/types'
import { colors } from '@/constants/Colors'
import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'
import Button from '@/components/ui/Button'
import { formatRelative } from 'date-fns'
import icons from '@/constants/icons'

export default function HabitScreen() {
	const { id, name, description, frequency, planned_time, notify } =
		useLocalSearchParams()
	const colorScheme = useColorScheme()
	const [session, setSession] = useState<Session | null>(null)
	const [habit, setHabit] = useState<Habit | null>(null)
	const [activity, setActivity] = useState<HabitEntry[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
			getHabitData(session?.user?.id ?? '')
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [id])

	async function getHabitData(user_id: string) {
		try {
			setLoading(true)
			if (!user_id) throw new Error('No user on the session in habit!')

			// const { data, error, status } = await supabase
			// 	.from('habits')
			// 	.select(`name, description, frequency, planned_time_minutes`)
			// 	.eq('id', id)
			// 	.single()

			// if (error && status !== 406) {
			// 	throw error
			// }

			// if (data) {
			setHabit({
				name: name?.toString() ?? '',
				description: description?.toString() ?? '',
				frequency: frequency?.toString() ?? '',
				planned_time_minutes: planned_time?.toString() ?? '',
			})
			const {
				data: activityData,
				error: activityError,
				status: activityStatus,
			} = await supabase
				.from('habit_entries')
				.select('entry_date, status, actual_time_minutes')
				.eq('habit_id', id)
				.order('entry_date', { ascending: false })
				.limit(5)

			if (activityError && activityStatus !== 406) {
				throw activityError
			}

			if (activityData) {
				setActivity(activityData)
			}
			// }
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<SafeAreaView
			style={{ backgroundColor: colors[colorScheme ?? 'light'].background }}
			className='h-full'>
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<ThemedView className='flex-1'>
					<View>
						<View
							className={`relative flex flex-col py-10 my-10 items-center justify-center ${
								colorScheme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'
							}`}>
							{notify === 'true' ? (
								<View className='absolute top-4 right-4'>
									<Image
										source={icons.notification}
										resizeMode='contain'
										tintColor={colors[colorScheme ?? 'light'].tint}
										className='w-6 h-6 rotate-45 opacity-80'
									/>
								</View>
							) : null}
							<ThemedText className='text-3xl font-pbold'>
								{habit?.name}
							</ThemedText>
							<ThemedText className='font-pregular'>
								{habit?.description}
							</ThemedText>
							<ThemedText
								style={{ color: colors[colorScheme ?? 'light'].tabIconDefault }}
								className='font-pitalic text-sm'>
								You planned this {frequency} for{' '}
								<Text className='text-lime-500'>{planned_time}</Text> minutes.
							</ThemedText>
						</View>
						<View className='flex flex-col space-y-2 px-4'>
							<View className='flex flex-row items-center justify-between mb-4'>
								<ThemedText className='text-xl font-pbold'>
									Recent activity
								</ThemedText>
								<Button
									title='Track'
									handlePress={() =>
										router.push(
											`/habits/track?id=${id}&name=${habit?.name}&frequency=${habit?.frequency}&planned_time=${habit?.planned_time_minutes}&to=${id}`
										)
									}
								/>
							</View>
							{loading ? (
								<View className='mt-10'>
									<ActivityIndicator
										animating={loading}
										color='#84cc16'
										size='large'
									/>
								</View>
							) : (
								activity.map((entry) => (
									<ThemedView
										key={entry.entry_date}
										className='flex-row items-center justify-between p-3 border border-gray-200 rounded-lg'>
										<ThemedText className='font-pbold'>
											{entry.status}
										</ThemedText>

										<ThemedText className='font-pregular'>
											{entry?.entry_date
												? formatRelative(new Date(entry.entry_date), new Date())
												: ''}
										</ThemedText>
									</ThemedView>
								))
							)}
						</View>
					</View>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	)
}
