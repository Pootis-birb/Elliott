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
    
    "device1":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/WSq19YnVwr?status=up&msg=OK&ping=",
    "device2":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/oOnnxrzf9Z?status=up&msg=OK&ping=",
    "device3":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/uROW95doST?status=up&msg=OK&ping=",
    "device4":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/mg7gzOBahT?status=up&msg=OK&ping=",
    "device5":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/UOaTdTZWOo?status=up&msg=OK&ping=",
    "device6":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/mTINnlsHC2?status=up&msg=OK&ping=",
    "device7":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/kTXP0E0g1Y?status=up&msg=OK&ping=",
    "device8":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/MZWgQ7d0VF?status=up&msg=OK&ping=",
    "device9":  "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/kPo9H3bfHg?status=up&msg=OK&ping=",
    "device10": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/HaZEpkPGwy?status=up&msg=OK&ping=",
    "device11": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/g665DoRpUD?status=up&msg=OK&ping=",
    "device12": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/RBrOYFekdB?status=up&msg=OK&ping=",
    "device13": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/d1tS4t9AWa?status=up&msg=OK&ping=",
    "device14": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/mvbCPwxVmF?status=up&msg=OK&ping=",
    "device15": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/5Zx7o78zjA?status=up&msg=OK&ping=",
    "device16": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/isDBknYzm9?status=up&msg=OK&ping=",
    "device17": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/CtpWN26t11?status=up&msg=OK&ping=",
    "device18": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/miB96aQW91?status=up&msg=OK&ping=",
    "device19": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/SK5MqARRwW?status=up&msg=OK&ping=",
    "device20": "https://creation-vacuum-actual-vpn.trycloudflare.com/api/push/dI6iSBYnxn?status=up&msg=OK&ping=",
    
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
