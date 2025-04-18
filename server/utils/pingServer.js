const cron = require("node-cron");
const https = require("https");

//In render free tier, the server goes to sleep after 15 minutes of inactivity.
//To prevent this, we will ping the server every 14 minutes.

const RENDER_URL = process.env.BACKEND_URI;

const schedulePingServer = ()=>{
    cron.schedule("*/10 * * * * *", () => {
        https.get(RENDER_URL, (res) => {
            console.log(`[${new Date().toISOString()}] Server responded with status: ${res.statusCode}`);
        }).on("error", (err) => {
            console.error(`[${new Date().toISOString()}] Failed to ping server:`, err.message);
        });
    });
}

module.exports = schedulePingServer;