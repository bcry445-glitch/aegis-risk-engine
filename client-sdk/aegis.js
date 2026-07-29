class AegisTelemetry {
    constructor() {
        this.session_id = 'sess_' + Math.random().toString(36).substr(2, 9);
        this.keystroke_flight_times = [];
        this.paste_detected = false;
        this.last_keydown_time = null;

        this.initBehavioralListeners();
    }

    // 1. Generate Canvas & WebGL Rendering Fingerprint
    generateCanvasHash() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("Aegis-Risk-Engine", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Aegis-Risk-Engine", 4, 17);
        
        // Simple hash function for the base64 canvas data
        let str = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // 2. Keystroke & Mouse Dynamics (Behavioral Biometrics)
    initBehavioralListeners() {
        const inputField = document.getElementById('test-input');
        if(!inputField) return;

        // Monitor Flight Time (time between key presses)
        inputField.addEventListener('keydown', (e) => {
            if (this.last_keydown_time) {
                const flightTime = Date.now() - this.last_keydown_time;
                this.keystroke_flight_times.push(flightTime);
            }
            this.last_keydown_time = Date.now();
        });

        // Detect Copy-Pasting (Bot & Environment Detection)
        inputField.addEventListener('paste', () => {
            this.paste_detected = true;
        });
    }

    // 3. Construct Payload and Send to API
    async sendTelemetry() {
        const avgFlightTime = this.keystroke_flight_times.length > 0 
            ? Math.round(this.keystroke_flight_times.reduce((a, b) => a + b) / this.keystroke_flight_times.length) 
            : 0;

        const payload = {
            session_id: this.session_id,
            device_fingerprint: {
                canvas_hash: this.generateCanvasHash(),
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                user_agent: navigator.userAgent,
                language: navigator.language,
                timezone_offset: new Date().getTimezoneOffset()
            },
            behavioral_biometrics: {
                keystroke_flight_time_avg_ms: avgFlightTime,
                mouse_velocity_jitter: Math.random() * 0.1, // Mocked for UI phase
                paste_detected: this.paste_detected
            },
            network_signals: {
                ip_address: "Client-IP-Hidden", // Usually handled by backend
                is_vpn_or_proxy: false // Placeholder for Day 2 integrations
            }
        };

        try {
            const response = await fetch('http://localhost:5000/api/v1/telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            document.getElementById('status-text').innerText = `✅ Success: ${data.message}`;
            document.getElementById('status-text').classList.replace('text-gray-400', 'text-green-400');
        } catch (error) {
            console.error("Telemetry failure:", error);
            document.getElementById('status-text').innerText = "❌ Failed to connect to AEGIS engine.";
            document.getElementById('status-text').classList.replace('text-gray-400', 'text-red-400');
        }
    }
}

// Initialize SDK and bind to UI button
const aegis = new AegisTelemetry();
document.getElementById('submit-btn').addEventListener('click', () => {
    document.getElementById('status-text').innerText = "Analyzing behavioral telemetry...";
    aegis.sendTelemetry();
});