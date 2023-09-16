chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "IMAGES") {
        console.log("this is the array:",message.images);
    }
});
