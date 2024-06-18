import { Image, ImageSourcePropType, Text, View } from 'react-native'

type TabBarIconProps = {
	icon: ImageSourcePropType | undefined
	color: string
	name: string
	focused: boolean
}

export function TabBarIcon({ icon, color, name, focused }: TabBarIconProps) {
	return (
		<View className='flex items-center justify-center gap-2'>
			<Image
				source={icon}
				resizeMode='contain'
				tintColor={color}
				className='w-6 h-6'
			/>
			<Text
				className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
				style={{ color: color }}>
				{name}
			</Text>
		</View>
	)
}
