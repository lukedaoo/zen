import {
    totalSeconds, zenContent, setZenDuration, getBackgroundImageUrl,
    setBackgroundImageUrl, getRandomBackgroundImageUrl
} from "./config.js";
import { getDominantColor, getContrastColor } from "./analyze-image.js";

let timerInterval;
let currentTotalSeconds = totalSeconds;
let zenContentDiv;

document.addEventListener("DOMContentLoaded", () => {
    // Populate initial welcome content using the zenContent object
    document.querySelector(".container p").textContent = zenContent.welcome.description;
    document.getElementById("start").textContent = zenContent.welcome.buttonText;
    document.getElementById("zenDuration").value = currentTotalSeconds / 60;

    // Event Listeners
    document.getElementById("start").addEventListener("click", handleStartClick);
    document.getElementById("settingsButton").addEventListener("click", handleSettingsButtonClick);
    document.getElementById("saveSettings").addEventListener("click", handleSaveSettingsClick);

    document.getElementById("stopZenButton").addEventListener("click", stopZen);

    document.getElementById("zenDuration").addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            document.getElementById("saveSettings").click();
        }
    });

    document.getElementById("backgroundImageUrl").addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            document.getElementById("saveSettings").click();
        }
    });

    document.addEventListener("click", handleDocumentClick);
});

function startTimer() {
    const timerDisplay = document.getElementById("timerDisplay");
    const endMessage = document.getElementById("endMessage");
    const stopButton = document.getElementById("stopZenButton");

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        const minutes = Math.floor(currentTotalSeconds / 60);
        const seconds = currentTotalSeconds % 60;

        timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        if (currentTotalSeconds <= 0) {
            clearInterval(timerInterval);

            timerDisplay.style.opacity = "0";
            stopButton.classList.remove("visible");
            stopButton.style.display = "none";

            if (endMessage) endMessage.style.opacity = "1";
            setTimeout(() => {
                stopZen();
            }, 2000);

        } else {
            currentTotalSeconds--;
        }
    }, 1000);
}

function createZenSessionContent(textColor = "#e0e0e0") {
    if (zenContentDiv) {
        zenContentDiv.remove();
    }

    zenContentDiv = document.createElement("div");
    zenContentDiv.className = "zen-content";
    zenContentDiv.style.color = textColor;
    document.body.appendChild(zenContentDiv);

    const zenMessageH2 = document.createElement("h2");
    zenMessageH2.id = "zenMessage";
    zenMessageH2.textContent = zenContent.zenSession.mainMessage;
    zenContentDiv.appendChild(zenMessageH2);

    const zenMessageP = document.createElement("p");
    zenMessageP.textContent = zenContent.zenSession.subMessage;
    zenContentDiv.appendChild(zenMessageP);

    const timerDisplay = document.createElement("div");
    timerDisplay.id = "timerDisplay";
    const initialMinutes = Math.floor(currentTotalSeconds / 60);
    const initialSeconds = currentTotalSeconds % 60;
    timerDisplay.textContent = `${initialMinutes.toString().padStart(2, "0")}:${initialSeconds.toString().padStart(2, "0")}`;
    zenContentDiv.appendChild(timerDisplay);

    const endMessage = document.createElement("div");
    endMessage.id = "endMessage";
    endMessage.textContent = zenContent.zenSession.completionMessage;
    zenContentDiv.appendChild(endMessage);

    const stopButton = document.getElementById("stopZenButton");
    zenContentDiv.appendChild(stopButton);
    stopButton.style.display = "block";

    setTimeout(() => {
        zenContentDiv.style.opacity = "1";
        setTimeout(() => {
            timerDisplay.style.opacity = "1";
            stopButton.classList.add("visible");
            startTimer();
        }, 1000);
    }, 100);
}

async function handleStartClick() {
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }

    // Hide initial UI elements
    const container = document.querySelector(".container");
    const settingsButton = document.getElementById("settingsButton");
    const settingsMenu = document.getElementById("settingsMenu");

    container.style.opacity = "0";
    settingsButton.style.opacity = "0";
    // settingsMenu.style.opacity = "0";
    settingsMenu.classList.remove("show");
    container.style.transition = "opacity 1s ease";

    // After fade-out, prepare and show zen session
    setTimeout(async () => {
        container.style.display = "none";
        settingsButton.style.display = "none";
        settingsMenu.style.display = "none";
        document.body.style.backgroundColor = "#0d0d0d"; // Default background color

        let savedBackgroundImageUrl = getBackgroundImageUrl();
        let textColor = "#e0e0e0";

        if (savedBackgroundImageUrl && savedBackgroundImageUrl == "random") {
            savedBackgroundImageUrl = getRandomBackgroundImageUrl();
        }

        if (savedBackgroundImageUrl) {
            document.body.style.backgroundImage = `url('${savedBackgroundImageUrl}')`;
            try {
                // Analyze image and determine contrast color
                const colors = await getDominantColor(savedBackgroundImageUrl);
                textColor = getContrastColor(colors.dominant.r, colors.dominant.g, colors.dominant.b);
            } catch (error) {
                console.error("Error analyzing image:", error);
            }
        }
        // Create and display zen content with the determined text color
        createZenSessionContent(textColor);

    }, 1000);
}



function stopZen() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    currentTotalSeconds = totalSeconds;

    if (zenContentDiv) {
        zenContentDiv.style.opacity = "0";
        const stopButton = document.getElementById("stopZenButton");
        stopButton.classList.remove("visible");

        zenContentDiv.remove();
        document.body.appendChild(stopButton);
    }

    const container = document.querySelector(".container");
    const settingsButton = document.getElementById("settingsButton");
    const settingsMenu = document.getElementById("settingsMenu");

    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#1a1a1a';

    container.style.display = "block";
    settingsButton.style.display = "flex";

    settingsMenu.classList.remove("show");
    settingsMenu.style.display = "block";

    setTimeout(() => {
        container.style.opacity = "1";
        settingsButton.style.opacity = "1";
    }, 100);
}

function handleSettingsButtonClick() {
    const settingsMenu = document.getElementById("settingsMenu");
    if (settingsMenu.classList.contains("show")) {
        settingsMenu.classList.remove("show");
    } else {
        settingsMenu.classList.add("show");
        // Update values in settings menu based on current config
        document.getElementById("zenDuration").value = currentTotalSeconds / 60;
        document.getElementById("backgroundImageUrl").value = getBackgroundImageUrl();
    }
}

function handleSaveSettingsClick() {
    const zenDurationInput = document.getElementById("zenDuration");
    let newDurationMinutes = parseFloat(zenDurationInput.value);

    if (isNaN(newDurationMinutes) || newDurationMinutes < 0.1) {
        console.warn("Invalid duration entered. Setting to 1 minute.");
        newDurationMinutes = 0.1;
        zenDurationInput.value = 0.1;
    }

    setZenDuration(newDurationMinutes);
    currentTotalSeconds = newDurationMinutes * 60;

    const backgroundImageUrl = document.getElementById("backgroundImageUrl").value.trim();
    setBackgroundImageUrl(backgroundImageUrl);

    document.getElementById("settingsMenu").classList.remove("show");
}

function handleDocumentClick(event) {
    const settingsMenu = document.getElementById("settingsMenu");
    const settingsButton = document.getElementById("settingsButton");

    if (!settingsMenu.contains(event.target) &&
        !settingsButton.contains(event.target) &&
        settingsMenu.classList.contains("show")) {
        settingsMenu.classList.remove("show");
    }
}
