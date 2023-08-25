const PORT_NUMBER = 11434
const URL_BASE = "http://localhost:"
const GENERATE_URL = URL_BASE + PORT_NUMBER + "/api/generate"
const MODEL_LIST_URL = URL_BASE + PORT_NUMBER + "/api/tags"

function streamInferredResponse(modelName, prompt, onNewWord) {
	const requestJson = buildRequestJson(modelName, prompt)
	postRequest(GENERATE_URL, requestJson)
		.then(async response => {
			await parseGenerateResponse(response, parsedResponse => {
				let word = parsedResponse.response
				if (word !== undefined) {
					onNewWord(word)
				}
			})
		})
		.catch(error => {
			console.log(error)
		})
}

function buildRequestJson(modelName, prompt) {
	return {
		model: modelName,
		prompt: prompt
	}
}

function postRequest(url, data) {
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
}

async function parseGenerateResponse(response, callback) {
	const reader = response.body.getReader()
	let partialLine = ''

	while (true) {
		const { done, value } = await reader.read()
		if (done) {
			break
		}

		// Decode the received value and split by lines
		const textChunk = new TextDecoder().decode(value)
		const lines = (partialLine + textChunk).split('\n')
		partialLine = lines.pop() // The last line might be incomplete

		for (const line of lines) {
			if (line.trim() === '') continue
			const parsedResponse = JSON.parse(line)
			callback(parsedResponse) // Process each response word
		}
	}

	// Handle any remaining line
	if (partialLine.trim() !== '') {
		const parsedResponse = JSON.parse(partialLine)
		callback(parsedResponse)
	}
}

function getModelList(onModelListLoaded) {
	fetch(MODEL_LIST_URL)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			return response.json()
		})
		.then(data => {
			onModelListLoaded(data.models)
		})
		.catch(error => {
			console.error('Error fetching data:', error)
		})
}
