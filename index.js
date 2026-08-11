const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// MULTI-MONITOR ROUTING MATRIX
// Add a comma after each line to map your different ESP32 devices to their distinct Kuma monitors!
const KUMA_MONITORS = {
    "device1": "https://veggie-smudge-cancel.ngrok-free.dev/api/push/5dOvp8OCl9?status=up&msg=OK&ping=",
    "device2": "https://ngrok-free.dev"
};

app.get('/ping', async (req, res) => {
    // Looks for the specific ID sent by the ESP32 (e.g., ?id=device2)
    // If an ESP32 forgets to send an ID, it automatically defaults to device1
    const monitorId = req.query.id || "device1"; 
    
    const kumaUrl = KUMA_MONITORS[monitorId];

    if (!kumaUrl) {
        console.error(`Received request for untracked monitor ID: ${monitorId}`);
        return res.status(400).send(`Error: Monitor ID '${monitorId}' is not configured on Render.`);
    }

    try {
        await axios.get(kumaUrl);
        console.log(`Successfully routed ping for: ${monitorId}`);
        res.status(200).send(`Forwarded successfully for ${monitorId}`);
    } catch (error) {
        console.error(`Network pipeline error for ${monitorId}:`, error.message);
        res.status(500).send("Error forwarding signal down the ngrok tunnel");
    }
});

app.listen(PORT, () => {
    console.log(`Multi-device bridge active on cloud port ${PORT}`);
});
