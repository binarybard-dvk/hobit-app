/*
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function getBasePointsForHabit(habit: string) {
	const prompt = `Suggest a base point allocation for the habit: ${habit}. Provide only the number of points.`

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini-2024-07-18',
			prompt: prompt,
			max_tokens: 10,
			n: 1,
			stop: null,
			temperature: 0.7,
		})

		const basePoints = response.data.choices[0].text.trim()
		return parseInt(basePoints, 10)
	} catch (error) {
		console.error('Error getting base points:', error)
		return null
	}
}
*/
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function getBasePointsForHabit(habit: string, time: number) {
	const prompt = `Point system: max points 30, min points 5. analyse the habit and suggest a base point allocation for the habit: ${habit} for ${time} minutes. Provide only the "number".`

	try {
		const result = await model.generateContent(prompt)
		const response = await result.response
		const responseText = response.text()
		console.log({ responseText })

		const pointsMatch = responseText.match(/(\d+)/)
		if (pointsMatch) {
			const basePoints = parseInt(pointsMatch[0], 10)
			return basePoints
		} else {
			console.error('No points found in the response')
			return 10
		}
	} catch (error) {
		console.error('Error getting base points:', error)
		return null
	}
}
