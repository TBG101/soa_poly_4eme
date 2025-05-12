// Install ws first: npm install ws

import { WebSocketServer } from 'ws';

export default function setupWebSocketServer(port) {
    const wss = new WebSocketServer({ port });

    wss.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('message', (message) => {
            console.log('Received:', message.toString());
        });

        socket.on('close', (code, reason) => {
            console.log('WebSocket connection closed:', code, reason.toString());
        });

        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    // Helper method to broadcast log to all clients
    wss.broadcastLog = (log) => {
        const message = JSON.stringify(log);
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    };

    console.log(`WebSocket server is running on ws://localhost:${port}`);
    return wss;
}
