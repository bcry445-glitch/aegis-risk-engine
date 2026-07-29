const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const levenshtein = require('fast-levenshtein');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON and enable CORS
app.use(cors());
app.use(express.json());

// 1. Initialize SQLite Database
const db = new sqlite3.Database('./aegis.db', (err) => {
    if (err) console.error(err.message);
    console.log('📦 Connected to the AEGIS SQLite database.');
});

// Create Devices Table
db.run(`CREATE TABLE IF NOT EXISTS devices (
    session_id TEXT PRIMARY KEY,
    canvas_hash TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Simulated OFAC / PEP Watchlist for AML Screening
const WATCHLIST = [
    "Osama Bin Laden",
    "El Chapo Guzman",
    "Pablo Escobar",
    "Kim Jong Un"
];

// Day 1 & 2: Telemetry Collector API (Now with DB Insertion)
app.post('/api/v1/telemetry', (req, res) => {
    const { session_id, device_fingerprint, network_signals } = req.body;

    if (!session_id || !device_fingerprint) {
        return res.status(400).json({ error: "Missing required telemetry data" });
    }

    // Insert device footprint into SQL database
    db.run(`INSERT INTO devices (session_id, canvas_hash, ip_address) VALUES (?, ?, ?)`,
        [session_id, device_fingerprint.canvas_hash, network_signals?.ip_address || 'unknown'],
        function(err) {
            if (err) {
                console.error("Database error:", err.message);
            } else {
                console.log(`[+] Device mapped in database: ${session_id} | Hash: ${device_fingerprint.canvas_hash}`);
            }
        }
    );

    res.status(200).json({
        status: "success",
        message: "Telemetry payload ingested successfully",
        session_id: session_id
    });
});

// Day 2: Continuous AML & Sanctions Screening Pipeline
app.post('/api/v1/screen', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required for screening" });

    let bestMatch = null;
    let lowestDistance = Infinity;

    // Execute fuzzy-string name matching using Levenshtein distance
    WATCHLIST.forEach(entity => {
        const distance = levenshtein.get(name.toLowerCase(), entity.toLowerCase());
        if (distance < lowestDistance) {
            lowestDistance = distance;
            bestMatch = entity;
        }
    });

    // A Levenshtein distance of 3 or less indicates a high probability of a match (e.g., typos, variations)
    const isHit = lowestDistance <= 3;

    console.log(`\n[🔍] AML Screening Executed for: "${name}"`);
    console.log(`     Closest Match: ${bestMatch} (Distance: ${lowestDistance})`);
    
    res.status(200).json({
        input_name: name,
        match_found: isHit,
        closest_match: bestMatch,
        levenshtein_distance: lowestDistance,
        resolution_status: isHit ? "PENDING_REVIEW" : "CLEARED"
    });
});

// Day 3: Fetch all devices for the Dashboard UI
app.get('/api/v1/devices', (req, res) => {
    db.all(`SELECT * FROM devices ORDER BY timestamp DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 AEGIS Risk Engine Backend is live on http://localhost:${PORT}`);
});