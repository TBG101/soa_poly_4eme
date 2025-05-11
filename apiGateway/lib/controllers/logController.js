export const logController = {
    sendLogs: (message, source, level) =>
        new Promise((resolve, reject) => {
            if (!message) {
                return reject(new Error("Message is required"));
            }

            fetch("http://localhost:5004/logs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message, source, level }),
            })
                .then((response) => {
                    if (!response.ok) {
                        return resolve({ success: false, error: "Failed to send logs" });
                    }
                    return response.json();
                })
                .then((data) => {
                    resolve({ success: true, error: null });
                })
                .catch((err) => {
                    resolve({ success: false, error: err.message });
                });
        }),
};
