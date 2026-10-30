const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// MULTI-MONITOR ROUTING MATRIX
const KUMA_MONITORS = {
    // If you keep ngrok, use the environment variable. When you transition to Cloudflare, paste your domain URL here
    "device1": process.env.UPTIME_KUMA_URL || "https://veggie-smudge-cancel.ngrok-free.dev/api/push/5dOvp8OCl9?status=up&msg=OK&ping=",
    "device2": "https://yourdomain.com"
};

app.get('/ping', async (req, res) => {
    // FIXED: Reads 'device' directly to perfectly match your ESP32's URL string
    const monitorId = req.query.device || "device1"; 
    const kumaUrl = KUMA_MONITORS[monitorId];

    if (!kumaUrl) {
        console.error(`Received request for untracked monitor ID: ${monitorId}`);
        return res.status(400).send(`Error: Monitor ID '${monitorId}' is not configured on Render.`);
    }

    try {
        // Handshake delivery to the network tunnel link
        await axios.get(kumaUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'ESP32-Cloud-Bridge-Relay'
            },
            timeout: 10000 // Prevents Render from hanging indefinitely if your home pipeline stalls
        });
        
        console.log(`Successfully routed ping for: ${monitorId}`);
        res.status(200).send(`Forwarded successfully for ${monitorId}`);
    } catch (error) {
        console.error(`Network pipeline error for ${monitorId}:`, error.message);
        
        // UPGRADED HANDLER: Instead of throwing a 500 crash code, return a friendly 503 fallback.
        // This alerts your ESP32 code's custom handler that the backend path is just sleeping or offline
        res.status(503).send(`Bridge endpoint target (${monitorId}) is unreachable. Server may be offline.`);
    }
});

// Root endpoint so Render's basic automated health check has a page to load 
app.get('/', (req, res) => {
    res.status(200).send("Bridge server is online and running cleanly.");
});

app.listen(PORT, () => {
    console.log(`Multi-device bridge active on cloud port ${PORT}`);
});
