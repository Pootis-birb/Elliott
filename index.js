const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// MULTI-MONITOR MAPPING
// Add as many as you want here! Just make sure the keys match your ngrok/Kuma push URLs
const KUMA_MONITORS = {
    "device1": "https://veggie-smudge-cancel.ngrok-free.dev/api/push/5dOvp8OCl9?status=up&msg=OK&ping=",
    "device2": "https://ngrok-free.dev",
    "device3": "https://ngrok-free.dev"
};

app.get('/ping', async (req, res) => {
    // Looks for ?id=xxxx in the URL path
    const monitorId = req.query.id; 
    
    // Check if the requested device exists in our list above
    const kumaUrl = KUMA_MONITORS[monitorId];

    if (!kumaUrl) {
        console.error(`Unknown or missing monitor ID requested: ${monitorId}`);
        return res.status(400).send("Error: Unknown or missing monitor ID");
    }

    try {
        await axios.get(kumaUrl);
        console.log(`Ping successfully forwarded for ${monitorId}!`);
        res.status(200).send(`Forwarded successfully for ${monitorId}`);
    } catch (error) {
        console.error(`Error forwarding for ${monitorId}:`, error.message);
        res.status(500).send("Error forwarding signal");
    }
});

app.listen(PORT, () => {
    console.log(`Multi-bridge listening on port ${PORT}`);
});
