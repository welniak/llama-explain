chrome.runtime.onMessage.addListener(
	function (message, sender, sendResponse) {
		if (message == 'clear') {
			onClear()
		} else {
			onResponseToken(message)
		}
	}
)

function onClear() {
	clearResponse()
	showLoadingSpinner()
}

function clearResponse() {
	explanationSpan().textContent = ""
}

function showLoadingSpinner() {
	if (loadingSpinner()) loadingSpinner().style.display = 'block'
}

function onResponseToken(token) {
	hideLoadingSpinner()
	addToResponse(token)
}

function hideLoadingSpinner() {
	if (loadingSpinner()) loadingSpinner().style.display = 'none'
}

function addToResponse(responseToken) {
	explanationSpan().textContent += responseToken
}

const explanationSpan = () => document.getElementById('explanationSpan')

const loadingSpinner = () => document.getElementById('loadingSpinner')