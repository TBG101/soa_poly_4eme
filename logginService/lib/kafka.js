import { Kafka } from 'kafkajs';

// Kafka configuration
const kafka = new Kafka({
    clientId: 'logging-service',
    brokers: ['localhost:9092'] // Replace with your Kafka broker addresses
});

export const producer = kafka.producer();

// Initialize Kafka producer
export async function initProducer() {
    await producer.connect();
    console.log('Kafka producer connected');
}

// Log function to send logs to Kafka
export async function logToKafka(level, message) {
    try {
        await producer.send({
            topic: 'logs', // Replace with your Kafka topic name
            messages: [
                { value: JSON.stringify({ level, message, timestamp: new Date().toISOString() }) }
            ]
        });
        console.log(`Log sent to Kafka: ${level} - ${message}`);
    } catch (error) {
        console.error('Error sending log to Kafka:', error);
    }
}