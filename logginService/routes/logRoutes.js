import { logToKafka } from "../lib/kafka.js";
import Log from "../models/logSchema.js";
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

    app.get("/logs", async (req, res) => {
        const { page = 1, limit = 10 } = req.query;

        try {
            const logs = await Log.find({})
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const totalLogs = await Log.countDocuments();
            const totalPages = Math.ceil(totalLogs / limit);

            console.log("Fetched logs from database:", logs);
            return res.status(200).send(
                JSON.stringify({
                    success: true,
                    error: null,
                    data: logs,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages,
                        totalLogs,
                    },
                })
            );
        } catch (err) {
            console.error("Error fetching logs from database:", err);
            return res.status(500).send(
                JSON.stringify({
                    success: false,
                    error: err.message,
                })
            );
        }
    });

    app.get("/analytics/most-visited-routes", async (req, res) => {
        try {
            const logs = await Log.find({ message: /Route changed to/ });

            const routeCounts = logs.reduce((acc, log) => {
                const match = log.message.match(/Route changed to (.+)/);
                if (match) {
                    const route = match[1];
                    acc[route] = (acc[route] || 0) + 1;
                }
                return acc;
            }, {});

            const sortedRoutes = Object.entries(routeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([route, count]) => ({ route, count }));

            return res.status(200).send({
                success: true,
                data: sortedRoutes,
            });
        } catch (err) {
            console.error("Error fetching analytics data:", err);
            return res.status(500).send({
                success: false,
                error: err.message,
            });
        }
    });
}
