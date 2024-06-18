import { supabase } from './supabase'

interface User {
	email: string
	password: string
	name?: string
}

export async function signUp({ email, password }: User) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: 'https://example.com/welcome',
		},
	})
}
