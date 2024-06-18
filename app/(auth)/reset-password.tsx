import { Image, ScrollView, useColorScheme } from 'react-native'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Controller, useForm } from 'react-hook-form'
import { Alert, View } from 'react-native'
import { colors } from '@/constants/Colors'
import Button from '@/components/ui/Button'
import logo from '@/assets/images/logo.png'
import { User } from '@/utils/types'
import { supabase } from '@/utils/supabase'
import FormInput from '@/components/ui/FormInput'
import { Link } from 'expo-router'

export default function ResetPassword() {
	const colorScheme = useColorScheme()
	const {
		control,
		handleSubmit,
		formState: { errors, isLoading },
	} = useForm({
		defaultValues: {
			password: '',
		},
	})
	const onSubmit = async (data: any) => {
		console.log(data)
	}

	return (
		<SafeAreaView
			style={{ backgroundColor: colors[colorScheme ?? 'light'].background }}
			className='h-full'>
			<ScrollView contentContainerStyle={{ height: '100%' }}>
				<ThemedView className='relative flex-1 justify-center items-center'>
					<Image source={logo} className='h-[80px]' resizeMode='contain' />
					<ThemedText className='text-3xl font-pbold my-2'>
						Reset your password!
					</ThemedText>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<FormInput
								label='Email'
								handleBlur={onBlur}
								handleChangeText={(value) => onChange(value)}
								value={value}
								keyboardType='email-address'
							/>
						)}
						name='password'
						rules={{ required: true }}
					/>

					<Button
						containerStyles={'mt-7 px-4 h-16 w-[90%]'}
						textStyles={'text-xl'}
						title='Reset Password'
						handlePress={handleSubmit(onSubmit)}
						loading={isLoading}
					/>

					<View className='justify-center items-center mt-4'>
						<ThemedText className='font-pregular'>
							Don't have an account?{' '}
							<Link className='text-lime-500 font-pmedium' href='/sign-up'>
								Sign up
							</Link>
						</ThemedText>
					</View>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	)
}
