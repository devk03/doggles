let images = [...document.images].map(img => img.src);
chrome.runtime.sendMessage({type: "IMAGES", images: images});
