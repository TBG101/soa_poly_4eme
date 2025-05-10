import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { logToKafka, initProducer, kafkaLogConsumer } from "./lib/kafka.js";
dotenv.config({
  path: "../.env",
});

const app = express();

const PORT = 5004;

mongoose.connect(process.env.MONGO_URI, {
  dbName: "Log",
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await initProducer().catch((error) => {
  console.error("Error initializing Kafka producer:", error);
});

kafkaLogConsumer();

app.post("/logs", (req, res) => {
  console.log("Received log:", req.body);
  const { level, message, source } = req.body;
  console.log("Received log:", message);
  console.log("Log level:", level);
  console.log("Log source:", source);
  logToKafka(level, message, source)
    .then(() => {
      return res.status(200).send(
        JSON.stringify({
          success: true,
          error: null,
        })
      );
    })
    .catch((error) => {
      console.error("Error sending log to Kafka:", error);
      return res.sendStatus(500).send(
        JSON.stringify({
          success: false,
          error: false,
        })
      );
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
