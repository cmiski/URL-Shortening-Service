import { Kafka } from "kafkajs";

// kafka client instance

export const kafka = new Kafka({
  clientId: "url-shortener",
  brokers: process.env.KAFKA_BROKERS.split(","), // Redpanda Broker
});

// producer instance --> publishes/sends messages to kafka topics, need to connect it before using
export const producer = kafka.producer();
// reads messages from kafka topics
export const consumer = kafka.consumer({ groupId: "click-analytics-group" }); // consumer group name
