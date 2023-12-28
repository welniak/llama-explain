window.onload = function () {
	getModelList(showModelList)
}

document.getElementById('dropdown').addEventListener('change', function (event) {
	saveSelectedModelName(event.target.value)
})

document.getElementById('infoIcon').addEventListener('click', function () {
	const explanationDiv = document.getElementById('modelExplanationDiv');
	if (explanationDiv.style.display === "none" || explanationDiv.style.display === "") {
		explanationDiv.style.display = "block";
	} else {
		explanationDiv.style.display = "none";
	}
});

function showModelList(modelList) {
	const dropdown = document.getElementById('dropdown')

	getSavedModelNameOrDefault(modelList, function (savedModelName) {
		modelList.forEach(model => {
			const option = document.createElement('option')
			option.value = model.name
			option.textContent = model.name
			dropdown.appendChild(option)
			if (model.name == savedModelName) option.selected = true
		})
	})
}

function getSavedModelNameOrDefault(llamaExplainModels, onModelRead) {
	chrome.storage.local.get(['selectedModelName'], function (result) {
		let selectedModelName
		const modelNameInStorage = result.selectedModelName
		if (modelNameInStorage === undefined) {
			selectedModelName = llamaExplainModels[0].name
		} else {
			selectedModelName = llamaExplainModels.find(model => model.name == modelNameInStorage).name
		}

		onModelRead(selectedModelName)
	})
}

function saveSelectedModelName(selectedModelName) {
	chrome.storage.local.set({ 'selectedModelName': selectedModelName })
}
