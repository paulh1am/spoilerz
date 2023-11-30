function removeTextFromStorage(textToRemove) {
    chrome.storage.local.get({hiddenTexts: []}, function(result) {
        var updatedHiddenTexts = result.hiddenTexts.filter(text => text !== textToRemove);
        chrome.storage.local.set({hiddenTexts: updatedHiddenTexts}, function() {
            console.log('Text removed:', textToRemove);
            displayHiddenTexts(); // Refresh the list

            // Send message to content script to update the text on the page
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "refreshView", text: textToRemove});
            });
        });
    });
}

// ... rest of your popup.js code


function createDeleteButton(text) {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';

    deleteButton.onclick = function() {
        removeTextFromStorage(text);
    };
    
    return deleteButton;
}

function displayHiddenTexts() {
    var listContainer = document.getElementById('hiddenTextsList');
    listContainer.innerHTML = ''; // Clear the current list

    chrome.storage.local.get({hiddenTexts: []}, function(result) {
        result.hiddenTexts.forEach(text => {
            var item = document.createElement('div');
            item.classList.add('hidden-text-item');
            item.textContent = text;
            item.appendChild(createDeleteButton(text));
            listContainer.appendChild(item);
        });
    });
}

document.getElementById('hideTextButton').addEventListener('click', function() {
    var textToHide = document.getElementById('textToHide').value;
    if (textToHide) {
        chrome.storage.local.get({hiddenTexts: []}, function(result) {
            var hiddenTexts = result.hiddenTexts;
            if (!hiddenTexts.includes(textToHide)) {
                hiddenTexts.push(textToHide);
                chrome.storage.local.set({hiddenTexts: hiddenTexts}, function() {
                    console.log('Text added to storage:', textToHide);
                    displayHiddenTexts(); // Refresh the list

                    // Send message to content script
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {action: "hide", text: textToHide});
                    });
                });
            }
        });
    }
});

// Initial display of hidden texts when the popup is opened
displayHiddenTexts();
