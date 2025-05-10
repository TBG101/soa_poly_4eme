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

export async function kafkaLogConsumer() {
  const consumer = kafka.consumer({ groupId: "logging-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "logs", fromBeginning: true });

  let logBatch = [];

  await consumer.run({
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
    }) => {
      for (const message of batch.messages) {
        const log = JSON.parse(message.value.toString());
        console.log("Received log:", log);
        logBatch.push(log);

        if (logBatch.length >= 10) {
          await saveLogsToDatabase(logBatch);
          logBatch = [];
        }

        resolveOffset(message.offset);
        await heartbeat();
      }
      // Save any remaining logs at the end of the batch
      if (logBatch.length > 0) {
        await saveLogsToDatabase(logBatch);
        logBatch = [];
      }
      await commitOffsetsIfNecessary();
      console.log("Offsets committed");
      console.log("Batch processed");
    },
  });
}
