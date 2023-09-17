window.chromeTabsQuery = function(queryInfo, callback) {
    chrome.tabs.query(queryInfo, callback);
};

window.chromeScriptingExecuteScript = function(details, callback) {
    chrome.scripting.executeScript(details, callback);
};