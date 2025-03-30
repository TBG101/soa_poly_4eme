import { Kafka } from "kafkajs";

// Kafka Setup
const kafka = new Kafka({
  clientId: "inventory-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
await producer.connect();

export { producer };
