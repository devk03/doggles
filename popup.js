document.getElementById('scrapeImagesBtn').addEventListener('click', function() {
    if (this.id === "scrapeImagesBtn") {
        console.log("Scraping images");
        this.innerText = "Revert to Human";
        this.id = "revertToHumanBtn";

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];

            chrome.scripting.executeScript({
                target: {tabId: currentTab.id},
                files: ['content.js']
            }, function() {
                console.log("Content script injected");
            });

        });

        chrome.runtime.onMessage.addListener(function listener(message, sender, sendResponse) {
            if (message.type === "IMAGES") {
                console.log("Received images:", message.images);
                chrome.runtime.onMessage.removeListener(listener);
            }
        });

    } else if (this.id === "revertToHumanBtn") {
        console.log("Reverting to Human");
        this.innerText = "Revert to Animal";
        this.id = "scrapeImagesBtn";
    }
});
