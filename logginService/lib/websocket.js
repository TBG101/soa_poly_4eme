import { WebSocketServer } from "ws";

export default function setupWebSocketServer(port) {
    const wss = new WebSocketServer({ port });
    const clients = new Set();

    wss.on("connection", (ws) => {
        console.log("New WebSocket connection established");
        clients.add(ws);

        ws.on("close", () => {
            console.log("WebSocket connection closed");
            clients.delete(ws);
        });
    });

    wss.broadcastLog = (log) => {
        for (const client of clients) {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(log));
            }
        }
    };

    return wss;
}
