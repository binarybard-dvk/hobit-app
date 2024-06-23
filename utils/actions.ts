import { supabase } from "./supabase";
import { Habit } from "./types";

interface User {
  email: string;
  password: string;
  name?: string;
}

export async function signUp({ email, password }: User) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://example.com/welcome",
    },
  });
}

export async function getSessionId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id;
}
export async function getHabits() {
  const user_id = await getSessionId();
  if (!user_id) throw new Error("No user on the session in habits!");

  const { data, error, status } = await supabase
    .from("habits")
    .select(`id, name, frequency, description, planned_time_minutes, notify`)
    .eq("user_id", user_id);

  if (error && status !== 406) {
    throw error;
  }

  return data;
}

export async function getHabitActivity(habitId: string) {
  const user_id = await getSessionId();
  if (!user_id) throw new Error("No user on the session in habits!");

  const {
    data: activityData,
    error: activityError,
    status: activityStatus,
  } = await supabase
    .from("habit_entries")
    .select("entry_date, status, actual_time_minutes")
    .eq("habit_id", habitId)
    .order("entry_date", { ascending: false })
    .limit(5);

  if (activityError && activityStatus !== 406) {
    throw activityError;
  }

  return activityData;
}

export async function createHabit(formData: any) {
  const user_id = await getSessionId();
  if (!user_id) throw new Error("No user on the session in habits!");
  const { data, error } = await supabase
    .from("habits")
    .insert({
      ...formData,
      user_id,
    })
    .select(`id`);

  if (error) {
    throw error;
  }

  return { ...formData, id: data?.[0].id };
}

export async function trackHabit(formData: any) {
  const { error } = await supabase.from("habit_entries").insert([formData]);

  if (error) {
    console.error("Error adding habit entry:", error);
    throw error;
  }

  return formData;
}

export async function getProfile() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.id) throw new Error("No user on the session in habits!");

  const { data, error, status } = await supabase
    .from("profiles")
    .select(`username, website, avatar_url`)
    .eq("id", session?.user?.id)
    .single();
  if (error && status !== 406) {
    throw error;
  }

  return { ...data, user_id: session?.user?.id, email: session?.user?.email };
}

export async function updateProfile({
  username,
  website,
  avatar_url,
}: {
  username: string;
  website: string;
  avatar_url: string;
}) {
  const user_id = await getSessionId();
  if (!user_id) throw new Error("No user on the session!");

  const updates = {
    id: user_id,
    username,
    website,
    avatar_url,
    updated_at: new Date(),
  };

  const { error } = await supabase.from("profiles").upsert(updates);

  if (error) {
    throw error;
  }
}
