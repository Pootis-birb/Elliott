const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// =========================================================================
//                       EASY-EDIT MONITOR MATRIX
// =========================================================================
// Add, change, or update your target tunnel URLs right here.
// You can copy-paste your links with or without "?status=up..." or "&ping="
const KUMA_MONITORS = {
    "device_test": process.env.UPTIME_KUMA_URL || "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/GjzO3QLBW4?status=up&msg=OK&ping=",
    
    "device1":  "https://trycloudflare.com",
    "device2":  "https://trycloudflare.com",
    "device3":  "https://trycloudflare.com",
    "device4":  "https://trycloudflare.com",
    "device5":  "https://trycloudflare.com",
    "device6":  "https://trycloudflare.com",
    "device7":  "https://trycloudflare.com",
    "device8":  "https://trycloudflare.com",
    "device9":  "https://trycloudflare.com",
    "device10": "https://trycloudflare.com",
    "device11": "https://trycloudflare.com",
    "device12": "https://trycloudflare.com",
    "device13": "https://trycloudflare.com",
    "device14": "https://trycloudflare.com",
    "device15": "https://trycloudflare.com",
    "device16": "https://trycloudflare.com",
    "device17": "https://trycloudflare.com",
    "device18": "https://trycloudflare.com",
    "device19": "https://trycloudflare.com",
    "device20": "https://trycloudflare.com",
    
    // To add more devices in the future, just add a comma above and follow this format:
    // "device21": "https://trycloudflare.com"
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
    let kumaUrl = KUMA_MONITORS[monitorId];

    if (!kumaUrl) {
        console.error(`Received request for untracked monitor ID: ${monitorId}`);
        return res.status(400).send(`Error: Monitor ID '${monitorId}' is not configured in the code list.`);
    }

    // SANITIZATION FILTER: Clean up lingering trailing string fragments automatically
    if (kumaUrl.endsWith('&ping=')) {
        kumaUrl = kumaUrl.replace('&ping=', '');
    } else if (kumaUrl.endsWith('?ping=')) {
        kumaUrl = kumaUrl.replace('?ping=', '');
    }

    // PARAMETER ENFORCEMENT FILTER: Safely inject active parameters required by Kuma
    if (!kumaUrl.includes('?')) {
        kumaUrl = `${kumaUrl}?status=up&msg=OK`;
    } else if (!kumaUrl.includes('status=')) {
        kumaUrl = `${kumaUrl}&status=up&msg=OK`;
    }

    try {
        // Forward the secure packet down the destination tunnel
        await axios.get(kumaUrl, {
            headers: { 'User-Agent': 'ESP32-Cloud-Bridge-Relay' },
            timeout: 10000 
        });
        
        console.log(`[ROUTING SUCCESS] ${monitorId} forwarded to -> ${kumaUrl}`);
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
    console.log(`Multi-device bridge list active on cloud port ${PORT}`);
});
