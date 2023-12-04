
function removeTextFromStorage(uniqueId) {
    chrome.storage.local.get({hiddenTexts: {}}, function(result) {
        delete result.hiddenTexts[uniqueId];  // Remove the text by its unique ID

        chrome.storage.local.set({hiddenTexts: result.hiddenTexts}, function() {
            console.log('Text removed:', uniqueId);
            displayHiddenTexts(); // Refresh the list

            // Send message to content script to unhide the text with the specific unique ID
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "unhide", uniqueId: uniqueId});
            });
        });
    });
}

// ... update other parts of popup.js to pass the correct index


// ... rest of your popup.js code


function createDeleteButton(uniqueId) {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';

    deleteButton.onclick = function() {
        removeTextFromStorage(uniqueId);
    };
    
    return deleteButton;
}

function displayHiddenTexts() {
    var listContainer = document.getElementById('hiddenTextsList');
    listContainer.innerHTML = ''; // Clear the current list
    console.log("display function")
    chrome.storage.local.get({hiddenTexts: {}}, function(result) {
        console.log(result);
        Object.entries(result.hiddenTexts).forEach(([uniqueId, text]) => {
            var item = document.createElement('div');
            item.classList.add('hidden-text-item');
            item.textContent = text;
            item.appendChild(createDeleteButton(uniqueId));
            listContainer.appendChild(item);
        });
    });
}

function addTextToStorage(textToAdd) {
    chrome.storage.local.get({hiddenTexts: {}}, function(result) {
        // Generate a unique ID using date and time
        const uniqueId = 'hiddenText' + new Date().getTime();

        result.hiddenTexts[uniqueId] = textToAdd;

        chrome.storage.local.set({hiddenTexts: result.hiddenTexts}, function() {
            console.log('Text added to storage:', textToAdd);
            displayHiddenTexts(); // Refresh the list
        });
    });
}


document.getElementById('hideTextButton').addEventListener('click', function() {
    var textToHide = document.getElementById('textToHide').value;
    if (textToHide) {
        chrome.storage.local.get({hiddenTexts: {}}, function(result) {
            // Convert result.hiddenTexts to an object if it's not
            var hiddenTexts = result.hiddenTexts instanceof Object ? result.hiddenTexts : {};
            
            // Check if the text is already stored
            let isTextStored = Object.values(hiddenTexts).includes(textToHide);
            if (!isTextStored) {
                // Generate a unique ID for the new text
                let uniqueId = new Date().getTime(); // Unique ID generation

                // Add the new text with its unique ID to the hiddenTexts object
                hiddenTexts[uniqueId] = textToHide;
                chrome.storage.local.set({hiddenTexts: hiddenTexts}, function() {
                    console.log('Text added to storage:', textToHide);
                    console.log(hiddenTexts);
                    displayHiddenTexts(); // Refresh the list

                    // Send message to content script to hide the text with the unique ID
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {action: "hide", uniqueId: uniqueId, text: textToHide});
                    });
                });
            }
        });
    }
});


// Initial display of hidden texts when the popup is opened

displayHiddenTexts();

