export interface User {
	email: string
	password?: string
	name?: string
}

export interface Habit {
	name: string
	description: string
	planned_time_minutes: string
	frequency: string
}
