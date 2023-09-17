window.settings = {
    DeuteranopiaOn: true,
    BrightnessDiscriminationOn: true,
    VisualAcuityValue: 5
};

document.addEventListener("DOMContentLoaded", function() {
    // Retrieve saved states from localStorage (if any)
    if (localStorage.getItem("isDeuteranopiaOn")) {
        window.settings.DeuteranopiaOn = JSON.parse(localStorage.getItem("isDeuteranopiaOn"));
        document.getElementById("deuteranopia").checked = window.settings.DeuteranopiaOn;
    }

    if (localStorage.getItem("isBrightnessDiscriminationOn")) {
        window.settings.BrightnessDiscriminationOn = JSON.parse(localStorage.getItem("isBrightnessDiscriminationOn"));
        document.getElementById("brightnessDiscrimination").checked = window.settings.BrightnessDiscriminationOn;
    }

    if (localStorage.getItem("visualAcuityValue")) {
        window.settings.VisualAcuityValue = parseInt(localStorage.getItem("visualAcuityValue"), 10);
        document.getElementById("visualAcuityRange").value = window.settings.VisualAcuityValue;
        document.getElementById("acuityValue").textContent = window.settings.VisualAcuityValue;
    }
    // Deuteranopia Switch
    var deuteranopiaSwitch = document.getElementById("deuteranopia");
    deuteranopiaSwitch.addEventListener("change", function() {
        window.settings.DeuteranopiaOn = deuteranopiaSwitch.checked;
        localStorage.setItem("isDeuteranopiaOn", JSON.stringify(window.settings.DeuteranopiaOn));
    });

    // Decreased Brightness Discrimination Switch
    var brightnessDiscriminationSwitch = document.getElementById("brightnessDiscrimination");
    brightnessDiscriminationSwitch.addEventListener("change", function() {
        window.settings.BrightnessDiscriminationOn = brightnessDiscriminationSwitch.checked;
        localStorage.setItem("isBrightnessDiscriminationOn", JSON.stringify(window.settings.BrightnessDiscriminationOn));
    });

    // Visual Acuity Slider
    var slider = document.getElementById("visualAcuityRange");
    var display = document.getElementById("acuityValue");
    slider.addEventListener("input", function() {
        window.settings.VisualAcuityValue = parseInt(slider.value, 10);
        display.textContent = window.settings.VisualAcuityValue;
        localStorage.setItem("visualAcuityValue", window.settings.VisualAcuityValue.toString());
    });
});

function getCurrentSettings() {
    return {
        DeuteranopiaOn: window.settings.DeuteranopiaOn,
        BrightnessDiscriminationOn: window.settings.BrightnessDiscriminationOn,
        VisualAcuityValue: window.settings.VisualAcuityValue
    };
}

