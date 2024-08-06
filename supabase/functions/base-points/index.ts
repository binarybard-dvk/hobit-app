// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenerativeAI } from 'npm:@google/generative-ai'

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { habit, time } = await req.json()
  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') ?? '')
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
	const prompt = `Point system: max points 30, min points 5. analyse the habit and suggest a base point allocation for the habit: ${habit} for ${time} minutes. Provide only the "number".`

	try {
		const result = await model.generateContent(prompt)
		const response = await result.response
		const responseText = response.text()
		console.log({ responseText })

		const pointsMatch = responseText.match(/(\d+)/)
		if (pointsMatch) {
			const basePoints = parseInt(pointsMatch[0], 10)
      return new Response(
        JSON.stringify({points: basePoints > 30 ? 30 : basePoints < 5 ? 5 : basePoints}),
        { headers: { "Content-Type": "application/json" } },
      )
		} else {
			console.error('No points found in the response')
      return new Response(
        JSON.stringify({points: 10}),
        { headers: { "Content-Type": "application/json" } },
      )
		}
	} catch (error) {
		console.error('Error getting base points:', error)
    return new Response(
      JSON.stringify({points: 10}),
      { headers: { "Content-Type": "application/json" } },
    )
	}

  
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/base-points' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
