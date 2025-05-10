import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-setup",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

async function setupKafkaTopics() {
  await admin.connect();

  await admin.createTopics({
    topics: [
      { topic: "logs", numPartitions: 1, replicationFactor: 1 },
      { topic: "order_placed", numPartitions: 1, replicationFactor: 1 },
    ],
  });

  console.log("✅ Kafka topics created");
  await admin.disconnect();
}

setupKafkaTopics().catch(console.error);
