export async function getBasePoints(habit: string, time: number) {
  try {
    const response = await fetch(
      "https://cdjlkelizdalisrzqvep.supabase.co/functions/v1/base-points",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ habit, time }),
      },
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    return res.points;
  } catch (error) {
    console.error("Error getting base points:", error);
    return 10;
  }
}
