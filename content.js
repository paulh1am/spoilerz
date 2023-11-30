function handleTextUpdate(action, textToProcess) {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = text;
                if (action === "hide") {
                    replacedText = text.replace(new RegExp(textToProcess, 'gi'), '[Hidden]');
                } else if (action === "refreshView") {
                    replacedText = text.replace(new RegExp('\\[Hidden\\]', 'gi'), '[*Refresh to View]');
                }
                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    handleTextUpdate(request.action, request.text);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    handleHideUnhide(request.action, request.text);
});

// ... rest of your content.js code


function hideText(textToHide) {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = text.replace(new RegExp(textToHide, 'gi'), '[Hidden]');
                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    hideText(request.text);
});





// Check storage and hide text on page load
chrome.storage.local.get({hiddenTexts: []}, function(result) {
    var hiddenTexts = result.hiddenTexts;
    hiddenTexts.forEach(text => {
        hideText(text);
    });
});
