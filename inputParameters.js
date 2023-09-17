export var settings = {
    DeuteranopiaOn: true,
    BrightnessDiscriminationOn: true,
    VisualAcuityValue: 5
}
document.addEventListener("DOMContentLoaded", function() {
    // State variables
    let isDeuteranopiaOn = true;
    let isBrightnessDiscriminationOn = true;
    let visualAcuityValue = 5;

    // Retrieve saved states from localStorage (if any)
    if (localStorage.getItem("isDeuteranopiaOn")) {
        isDeuteranopiaOn = JSON.parse(localStorage.getItem("isDeuteranopiaOn"));
        document.getElementById("deuteranopia").checked = isDeuteranopiaOn;
    }

    if (localStorage.getItem("isBrightnessDiscriminationOn")) {
        isBrightnessDiscriminationOn = JSON.parse(localStorage.getItem("isBrightnessDiscriminationOn"));
        document.getElementById("brightnessDiscrimination").checked = isBrightnessDiscriminationOn;
    }

    if (localStorage.getItem("visualAcuityValue")) {
        visualAcuityValue = parseInt(localStorage.getItem("visualAcuityValue"), 10);
        document.getElementById("visualAcuityRange").value = visualAcuityValue;
        document.getElementById("acuityValue").textContent = visualAcuityValue;
    }

    // Deuteranopia Switch
    var deuteranopiaSwitch = document.getElementById("deuteranopia");
    deuteranopiaSwitch.addEventListener("change", function() {
        isDeuteranopiaOn = deuteranopiaSwitch.checked;
        localStorage.setItem("isDeuteranopiaOn", JSON.stringify(isDeuteranopiaOn));
        // Here, you can add additional logic for when this switch is changed.
        console.log("Deuteranopia is now " + (isDeuteranopiaOn ? "on" : "off"));
    });

    // Decreased Brightness Discrimination Switch
    var brightnessDiscriminationSwitch = document.getElementById("brightnessDiscrimination");
    brightnessDiscriminationSwitch.addEventListener("change", function() {
        isBrightnessDiscriminationOn = brightnessDiscriminationSwitch.checked;
        localStorage.setItem("isBrightnessDiscriminationOn", JSON.stringify(isBrightnessDiscriminationOn));
        // Here, you can add additional logic for when this switch is changed.
        console.log("Brightness Discrimination is now " + (isBrightnessDiscriminationOn ? "on" : "off"));
    });

    // Visual Acuity Slider
    var slider = document.getElementById("visualAcuityRange");
    var display = document.getElementById("acuityValue");
    slider.addEventListener("input", function() {
        visualAcuityValue = parseInt(slider.value, 10);
        display.textContent = visualAcuityValue;
        localStorage.setItem("visualAcuityValue", visualAcuityValue);
        console.log("Visual Acuity is now " + visualAcuityValue);
    });
    settings.DeuteranopiaOn = isDeuteranopiaOn;
    settings.BrightnessDiscriminationOn = isBrightnessDiscriminationOn;
    settings.VisualAcuityValue = visualAcuityValue;
});
