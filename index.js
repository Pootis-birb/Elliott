const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// TODO: Paste your real Uptime Kuma URL between the quotes below
const KUMA_URL = "https://veggie-smudge-cancel.ngrok-free.dev/api/push/5dOvp8OCl9?status=up&msg=OK&ping=";

app.get('/ping', async (req, res) => {
    try {
        await axios.get(KUMA_URL);
        console.log("Ping successfully forwarded to Uptime Kuma!");
        res.status(200).send("Forwarded successfully");
    } catch (error) {
        console.error("Error forwarding to Kuma:", error.message);
        res.status(500).send("Error forwarding signal");
    }
});

app.listen(PORT, () => {
    console.log(`Free bridge listening on port ${PORT}`);
});
