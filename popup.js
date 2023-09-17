document.addEventListener("DOMContentLoaded", function () {
    // Register the message listener once outside of the button click
    chrome.runtime.onMessage.addListener(function listener(
      message,
      sender,
      sendResponse
    ) {
      if (message.type === "IMAGES") {
        chrome.runtime.onMessage.removeListener(listener);
      }
    });
  
    const btn = document.getElementById("scrapeImagesBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        const currentSettings = getCurrentSettings();
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }
        if (this.id === "scrapeImagesBtn") {
          this.innerText = "Revert to Human";
          this.id = "revertToHumanBtn";
  
          window.chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              let currentTab = tabs[0];
              // First inject doggle.js
              window.chrome.scripting.executeScript(
                {
                  target: { tabId: currentTab.id },
                  files: ["doggle.js"],
                },
                function () {    
                    console.log("Doggle script injected");              
                  // Now inject content.js
                  window.chrome.scripting.executeScript(
                    {
                      target: { tabId: currentTab.id },
                      files: ["content.js"],
                    },
                    function () {
                      console.log("Content script injected");
  
                      // Send the currentSettings to the content script
                      chrome.tabs.sendMessage(currentTab.id, {
                        type: "SETTINGS",
                        data: currentSettings,
                      });
                    }
                  );
                }
              );
            }
          );
        } else if (this.id === "revertToHumanBtn") {
          console.log("Reverting to Human");
          this.innerText = "Revert to Animal";
          this.id = "scrapeImagesBtn";
        }
      });
    } else {
      console.error("Button not found in the DOM.");
    }
  });  