import React, { useEffect, useState } from 'react'
import {
	View,
	Text,
	Alert,
	useColorScheme,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
} from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'
import { Habit, HabitEntry } from '@/utils/types'
import { colors } from '@/constants/Colors'
import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'

export default function HabitScreen() {
	const { id } = useLocalSearchParams()
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

			const { data, error, status } = await supabase
				.from('habits')
				.select(`name, description, frequency, planned_time_minutes`)
				.eq('id', id)
				.single()

			if (error && status !== 406) {
				throw error
			}

			if (data) {
				setHabit(data)
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
			}
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
				<ThemedView className='flex-1 justify-center items-center'>
					{loading ? (
						<ActivityIndicator
							animating={loading}
							color='#84cc16'
							size='large'
						/>
					) : (
						<View>
							<ThemedText className='text-3xl font-pbold'>
								{habit?.name}
							</ThemedText>
							<ThemedText className='font-pregular'>
								{habit?.description}
							</ThemedText>
						</View>
					)}
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	)
}
