
// ... rest of your content.js code


function hideText(textToHide, uniqueId) {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
            if (node.nodeType === 3 && node.nodeValue.includes(textToHide)) {
                var replacementText = 'Spoiler hidden'; // The text to display instead of the spoiler

                var span = document.createElement('span');
                span.setAttribute('data-hidden-id', uniqueId);
                span.textContent = replacementText; // Set the replacement text
                span.style.cursor = 'pointer'; // Optional: change cursor to indicate clickable
                span.onclick = function() { unhideText(uniqueId); }; // Optional: click to unhide

                element.replaceChild(span, node);
            }
        }
    }
}

function unhideText(uniqueId) {
    var hiddenElements = document.querySelectorAll('span[data-hidden-id="' + uniqueId + '"]');
    hiddenElements.forEach(function(element) {
        if (element.textContent === 'Spoiler hidden') {
            // Replace with original text
            element.textContent = element.getAttribute('data-original-text');
        } else {
            // Store original text and hide it again
            element.setAttribute('data-original-text', element.textContent);
            element.textContent = 'Spoiler hidden';
        }
    });
}



//chrome runtime listener actions

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "hide") {
        // Retrieve the text using the unique ID
        chrome.storage.local.get({hiddenTexts: {}}, function(result) {
            var textToHide = result.hiddenTexts[request.uniqueId];
            if (textToHide) {
                hideText(textToHide, request.uniqueId);
            }
        });
    }
    else if (request.action === "unhide") {
        // Unhide using the unique ID
        console.log("unhiding")
        console.log(request.uniqueId);
        unhideText(request.uniqueId);
    }
});




// Check storage and hide text on page load
chrome.storage.local.get({hiddenTexts: {}}, function(result) {
    var hiddenTexts = result.hiddenTexts;
    Object.entries(hiddenTexts).forEach(([uniqueId, text]) => {
        hideText(text, uniqueId);
    });
});