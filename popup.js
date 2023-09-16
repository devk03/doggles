document.getElementById('scrapeImagesBtn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let currentTab = tabs[0];
        chrome.scripting.executeScript({
            target: {tabId: currentTab.id},
            files: ['content.js']
        });
    });
});
