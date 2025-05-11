import { Kafka } from "kafkajs";
import Log from "../models/logSchema.js";

// Kafka configuration
const kafka = new Kafka({
  clientId: "logging-service",
  brokers: ["localhost:9092"], // Replace with your Kafka broker addresses
});

export const producer = kafka.producer();

// Initialize Kafka producer
export async function initProducer() {
  await producer.connect();
  console.log("Kafka producer connected");
}

// Log function to send logs to Kafka
export async function logToKafka(level, message, source) {
  try {
    await producer.send({
      topic: "logs",
      messages: [
        {
          value: JSON.stringify({
            level,
            message,
            source,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    console.log(`Log sent to Kafka: ${level} - ${message}`);
  } catch (error) {
    console.error("Error sending log to Kafka:", error);
  }
}

async function saveLogsToDatabase(logs) {
  console.log("Saving logs to the database:", logs);

  try {
    await Log.insertMany(logs);
    console.log("Logs saved to the database");
  } catch (error) {
    console.error("Error saving logs to the database:", error);
  }
}

let logBatch = [];
let batchTimer;

const BATCH_SIZE = 10;
const BATCH_TIMEOUT_MS = 5000;

async function flushLogs() {
  if (logBatch.length === 0) return;

  const batchToSave = [...logBatch];
  logBatch = [];

  try {
    await saveLogsToDatabase(batchToSave);
  } catch (err) {
    console.error("Error saving logs:", err);
    // Optional: add retry logic here
  }
}

function scheduleFlush() {
  if (batchTimer) clearTimeout(batchTimer);
  batchTimer = setTimeout(() => flushLogs(), BATCH_TIMEOUT_MS);
}

export async function kafkaLogConsumer() {
  const consumer = kafka.consumer({ groupId: "logging-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "logs", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const log = JSON.parse(message.value.toString());
      logBatch.push(log);

      if (logBatch.length >= BATCH_SIZE) {
        await flushLogs();
      } else {
        scheduleFlush();
      }
    },
  });
}

// Flush remaining logs on shutdown
process.on("SIGINT", async () => {
  await flushLogs();
  process.exit();
});
