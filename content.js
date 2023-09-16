let images = [...document.images].map(img => img.src);
console.log("Content script ran and scraped images."); // This will help you verify the script ran.
chrome.runtime.sendMessage({type: "IMAGES", images: images});
