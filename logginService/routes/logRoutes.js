export default function setupRoutes(app, wss) {
    app.post("/logs", (req, res) => {
        console.log("Received log:", req.body);
        const { level, message, source } = req.body;
        console.log("Received log:", message);
        console.log("Log level:", level);
        console.log("Log source:", source);

        const log = { level, message, source, timestamp: new Date() };

        logToKafka(level, message, source)
            .then(() => {
                // Broadcast the log to WebSocket clients
                wss.broadcastLog(log);

                return res.status(200).send(
                    JSON.stringify({
                        success: true,
                        error: null,
                    })
                );
            })
            .catch((error) => {
                console.error("Error sending log to Kafka:", error);
                return res.status(500).send(
                    JSON.stringify({
                        success: false,
                        error: error.message,
                    })
                );
            });
    });
}
