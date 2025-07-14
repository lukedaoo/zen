export function getDominantColor(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function() {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const colorMap = {};

            for (let i = 0; i < data.length; i += 16) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Group colors into bins (e.g., 0-9, 10-19, etc.) to find dominant range
                const key = `${Math.floor(r / 10) * 10}-${Math.floor(g / 10) * 10}-${Math.floor(b / 10) * 10}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
            }

            // Find the color range with the highest count (dominant)
            const dominantColorKey = Object.keys(colorMap).reduce((a, b) =>
                colorMap[a] > colorMap[b] ? a : b
            );

            // Extract RGB values from the dominant color key
            const [rDominant, gDominant, bDominant] = dominantColorKey.split("-").map(Number);

            // Calculate average color for overall brightness assessment
            let totalR = 0, totalG = 0, totalB = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) { 
                totalR += data[i];
                totalG += data[i + 1];
                totalB += data[i + 2];
                count++;
            }

            const avgR = Math.round(totalR / count);
            const avgG = Math.round(totalG / count);
            const avgB = Math.round(totalB / count);

            resolve({
                dominant: { r: rDominant, g: gDominant, b: bDominant },
                average: { r: avgR, g: avgG, b: avgB }
            });
        };

        img.onerror = () => reject(new Error("Failed to load image for analysis. Please ensure it is a valid URL and supports CORS."));
        img.src = imageUrl;
    });
}

export function getBrightness(r, g, b) {
    // Standard formula for perceived luminance (brightness)
    return (0.299 * r + 0.587 * g + 0.114 * b);
}

export function getContrastColor(r, g, b) {
    const brightness = getBrightness(r, g, b);
    // Use a threshold to decide between black and white text
    return brightness > 128 ? "#000000" : "#ffffff";
}

export function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}
