importScripts("ollama.js")

const CONTEXT_MENU_ID = "LLAMA_EXPLAIN"

let popupWindowId
let popupTabId

chrome.contextMenus.create({
    "id": CONTEXT_MENU_ID,
    "title": "llama explain",
    "contexts": ["selection"]
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        getSelectedModelName(function (selectedModelName) {
            openOrFocusPopup()
            clearPreviousOutput()
            streamInferredResponse(
                selectedModelName,
                info.selectionText,
                sendResponseToPopUp
            )
        })
    }
})

function getSelectedModelName(onModelNameLoaded) {
    chrome.storage.local.get(['selectedModelName'], function (result) {
        if (result === undefined || result.selectedModelName === undefined) {
            fetchFirstAvailableModel(onModelNameLoaded)
        } else {
            onModelNameLoaded(result.selectedModelName)
        }
    })
}

function fetchFirstAvailableModel(onModelNameLoaded) {
    getModelList(function (modelList) {
        onModelNameLoaded(modelList.filter(model => model.name.includes('llama-explain'))[0].name)
    })
}

function openOrFocusPopup() {
    if (popupWindowId !== undefined) {
        chrome.windows.get(popupWindowId, { populate: true }, function (window) {
            if (chrome.runtime.lastError) {
                createPopup()
            } else {
                chrome.windows.update(popupWindowId, { focused: true })
            }
        })
    } else {
        createPopup()
    }
}

function createPopup() {
    chrome.windows.create({
        url: chrome.runtime.getURL('explanation-popup.html'),
        type: 'popup',
        width: 600,
        height: 800
    }, function (window) {
        popupWindowId = window.id
        popupTabId = window.tabs[0].id
    })
}

function sendResponseToPopUp(response) {
    chrome.tabs.sendMessage(popupTabId, response)
}

function clearPreviousOutput() {
    if (popupTabId !== undefined) chrome.tabs.sendMessage(popupTabId, "clear")
}
