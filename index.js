const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// MULTI-MONITOR ROUTING MATRIX
const KUMA_MONITORS = {
    // Pulls the verified link from your Render Environment Dashboard dynamically
    "device1": process.env.UPTIME_KUMA_URL || "https://veggie-smudge-cancel.ngrok-free.dev/api/push/5dOvp8OCl9?status=up&msg=OK&ping=",
    "device2": "https://ngrok-free.dev"
};

app.get('/ping', async (req, res) => {
    const monitorId = req.query.id || "device1"; 
    const kumaUrl = KUMA_MONITORS[monitorId];

    if (!kumaUrl) {
        console.error(`Received request for untracked monitor ID: ${monitorId}`);
        return res.status(400).send(`Error: Monitor ID '${monitorId}' is not configured on Render.`);
    }

    try {
        // FIXED: Added the required skip header object to bypass ngrok's warning page
        await axios.get(kumaUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        console.log(`Successfully routed ping for: ${monitorId}`);
        res.status(200).send(`Forwarded successfully for ${monitorId}`);
    } catch (error) {
        console.error(`Network pipeline error for ${monitorId}:`, error.message);
        res.status(500).send("Error forwarding signal down the ngrok tunnel");
    }
});

// Root endpoint so Render's basic automated health check has a page to load 
app.get('/', (req, res) => {
    res.status(200).send("Bridge server is online and running cleanly.");
});

app.listen(PORT, () => {
    console.log(`Multi-device bridge active on cloud port ${PORT}`);
});
