// config/langgraph-checkpointer.js

import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

let mongoClient;
let checkpointer;

export const getCheckpointer = async () => {
  if (checkpointer) {
    return checkpointer;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  mongoClient = new MongoClient(process.env.MONGODB_URI);

  await mongoClient.connect();

  checkpointer = new MongoDBSaver({
    client: mongoClient,
  });

  return checkpointer;
};