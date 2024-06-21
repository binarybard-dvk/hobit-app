import {
	Image,
	StyleSheet,
	Platform,
	ScrollView,
	Alert,
	View,
	ActivityIndicator,
} from 'react-native'

import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from '@/hooks/useColorScheme'
import { colors } from '@/constants/Colors'
import Button from '@/components/ui/Button'
import { Link, Redirect, router } from 'expo-router'
import { Habit } from '@/utils/types'

export default function HabitsScreen() {
	const colorScheme = useColorScheme()
	const [session, setSession] = useState<Session | null>(null)
	const [habits, setHabits] = useState<Habit[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
			getHabits(session?.user?.id ?? '')
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	// if (!session) {
	// 	return <Redirect href='/sign-in' />
	// }

	async function getHabits(user_id: string) {
		try {
			setLoading(true)
			if (!user_id) throw new Error('No user on the session in habits!')

			const { data, error, status } = await supabase
				.from('habits')
				.select(
					`id, name, frequency, description, planned_time_minutes, notify`
				)
				.eq('user_id', user_id)

			if (error && status !== 406) {
				throw error
			}

			if (data) {
				setHabits(data as Habit[])
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
				<ThemedView className='flex-1 flex-col space-y-2'>
					<View
						className={`flex flex-col py-10 my-10 items-center justify-center ${
							colorScheme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'
						}`}>
						<ThemedText className='text-3xl font-pbold mt-10'>
							Welcome back!
						</ThemedText>
					</View>

					<View className='px-4'>
						<ThemedText className='text-xl font-pbold mb-4'>
							Your habits:
						</ThemedText>
						<View className='space-y-2'>
							{loading ? (
								<View className='mt-10'>
									<ActivityIndicator
										animating={loading}
										color='#84cc16'
										size='large'
									/>
								</View>
							) : (
								habits.map((habit) => (
									<ThemedView
										key={habit.name}
										className='flex-row items-center justify-between p-3 border border-gray-200 rounded-lg'>
										<ThemedText className='font-pbold'>{habit.name}</ThemedText>
										<View className='flex flex-row items-center gap-4'>
											<Link
												className='text-lime-600'
												href={`/habits/track?id=${habit.id}&name=${habit.name}&frequency=${habit.frequency}&planned_time=${habit.planned_time_minutes}&to=`}>
												Track
											</Link>
											<Link
												className='text-lime-600'
												href={`/habits/${habit.id}?name=${habit.name}&description=${habit.description}&frequency=${habit.frequency}&planned_time=${habit.planned_time_minutes}&notify=${habit.notify}`}>
												View
											</Link>
										</View>
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
