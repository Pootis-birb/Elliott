const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// MULTI-MONITOR ROUTING MATRIX
const KUMA_MONITORS = {
    // Test Instance (Kept exactly as you wrote it)
    "device_test": process.env.UPTIME_KUMA_URL || "https://trycloudflare.com",
    
    // Production Fleet (1 to 20)
    "device1":  "https://yourdomain.com",
    "device2":  "https://yourdomain.com",
    "device3":  "https://yourdomain.com",
    "device4":  "https://yourdomain.com",
    "device5":  "https://yourdomain.com",
    "device6":  "https://yourdomain.com",
    "device7":  "https://yourdomain.com",
    "device8":  "https://yourdomain.com",
    "device9":  "https://yourdomain.com",
    "device10": "https://yourdomain.com",
    "device11": "https://yourdomain.com",
    "device12": "https://yourdomain.com",
    "device13": "https://yourdomain.com",
    "device14": "https://yourdomain.com",
    "device15": "https://yourdomain.com",
    "device16": "https://yourdomain.com",
    "device17": "https://yourdomain.com",
    "device18": "https://yourdomain.com",
    "device19": "https://yourdomain.com",
    "device20": "https://yourdomain.com"
};

// ANTI-SLEEP ENGINE: Keeps Render awake
setInterval(() => {
    const myRenderUrl = process.env.RENDER_EXTERNAL_URL;
    if (myRenderUrl) {
        axios.get(myRenderUrl).catch(() => { /* Ignore background errors */ });
    }
}, 600000); // 10 minutes

app.get('/ping', async (req, res) => {
    const monitorId = req.query.device || "device_test"; 
    const kumaUrl = KUMA_MONITORS[monitorId];

    if (!kumaUrl) {
        console.error(`Received request for untracked monitor ID: ${monitorId}`);
        return res.status(400).send(`Error: Monitor ID '${monitorId}' is not configured.`);
    }

    try {
        // Direct, unaltered delivery. It sends your exact URL string to Kuma.
        await axios.get(kumaUrl, {
            headers: { 'User-Agent': 'ESP32-Cloud-Bridge-Relay' },
            timeout: 10000 
        });
        
        console.log(`Successfully routed ping for: ${monitorId}`);
        res.status(200).send(`Forwarded successfully for ${monitorId}`);
    } catch (error) {
        console.error(`Network pipeline error for ${monitorId}:`, error.message);
        res.status(503).send(`Bridge endpoint target (${monitorId}) is unreachable.`);
    }
});

app.get('/', (req, res) => {
    res.status(200).send("Bridge server is online and running cleanly.");
});

app.listen(PORT, () => {
    console.log(`Multi-device bridge active on cloud port ${PORT}`);
});
