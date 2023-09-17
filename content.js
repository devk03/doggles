console.log("Content script ran and scraped images.");

function isCrossOrigin(imgSrc) {
    const imgURL = new URL(imgSrc, window.location.href);
    return imgURL.origin !== window.location.origin;
}

var imagesData = [...document.images].map(img => {
    return {
        element: img, // Added the image element for direct reference.
        src: img.src,
        alt: img.alt,
        title: img.title,
    };
});

console.log("After Images Data.", imagesData);

// The imgprocess function you provided should be defined somewhere above.

function processAndReplaceImage(imgData, deuter, decbright, decac) {
    if (isCrossOrigin(imgData.src)) {
        return;  // Skip processing for cross-origin images
    }
    // Create a new Image object
    const imageObj = new Image();

    imageObj.onload = function() {
        // Create a temporary canvas and context
        const canvas = document.createElement('canvas');
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageObj, 0, 0);

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Process the image
        const processedPixels = imgprocess(pixels, deuter, decbright, decac);

        ctx.putImageData(processedPixels, 0, 0);

        // Replace the src of the original image element with the processed one.
        imgData.element.src = canvas.toDataURL();

        // You might also want to replace alt and title, depending on your requirements.
        imgData.element.alt = imgData.alt;
        imgData.element.title = imgData.title;
    };

    imageObj.src = imgData.src;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "SETTINGS") {
        const settings = message.data;
        // Now, you can use `settings` in your content script.
        console.log("does this shit run?", settings)
        // Example usage:
        for (let i = 0; i < imagesData.length; i++) {
            let img = imagesData[i];
            processAndReplaceImage(
                img, 
                settings.DeuteranopiaOn, 
                settings.BrightnessDiscriminationOn, 
                settings.VisualAcuityValue === 5 // Adjust this based on your requirements
            );
        }
    }
});

