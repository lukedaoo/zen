export let totalSeconds = (localStorage.getItem("zenDurationMinutes")
    ? parseFloat(localStorage.getItem("zenDurationMinutes")) : 5) * 60;

export const zenContent = {
    welcome: {
        description: "Breathe deep, still your mind, and find your zen.",
        buttonText: "zen"
    },
    zenSession: {
        mainMessage: "Breathe. Be.",
        subMessage: "Find your calm.",
        completionMessage: "Now get back to work."
    },
    defaultBackgrounds: [
        "https://images.pexels.com/photos/1702812/pexels-photo-1702812.jpeg", // white background,
        "https://images.pexels.com/photos/695644/pexels-photo-695644.jpeg" // dark background
    ]
};


export function setZenDuration(minutes) {
    totalSeconds = minutes * 60;
    localStorage.setItem("zenDurationMinutes", minutes);
}

export function getBackgroundImageUrl() {
    return localStorage.getItem("zenBackgroundImageUrl") || "";
}

export function getRandomBackgroundImageUrl() {
    const randomIndex = Math.floor(Math.random() * zenContent.defaultBackgrounds.length);
    return zenContent.defaultBackgrounds[randomIndex];
}

export function setBackgroundImageUrl(url) {
    if (url) {
        localStorage.setItem("zenBackgroundImageUrl", url);
    } else {
        localStorage.removeItem("zenBackgroundImageUrl");
    }
}
