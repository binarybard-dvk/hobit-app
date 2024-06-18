import { Image, StyleSheet, Platform, ScrollView } from 'react-native'

import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from '@/hooks/useColorScheme'
import { colors } from '@/constants/Colors'
import Button from '@/components/ui/Button'

export default function Habits() {
	const [session, setSession] = useState<Session | null>(null)
	const colorScheme = useColorScheme()

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			console.log('session: ', session)
			setSession(session)
		})

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	return (
		<SafeAreaView
			style={{ backgroundColor: colors[colorScheme ?? 'light'].background }}
			className='h-full'>
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<ThemedView className='flex-1 justify-center items-center'>
					<ThemedText className='text-3xl font-pbold'>Hobit</ThemedText>
					<ThemedText>
						{session && session.user && (
							<ThemedText>{session.user.id}</ThemedText>
						)}
					</ThemedText>
					<Button
						title='Sign Out'
						handlePress={() => supabase.auth.signOut()}
					/>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	)
}
