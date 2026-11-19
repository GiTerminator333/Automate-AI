import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";

import { getCheckpointer } from "../config/langgraph-checkpointer.js";

const model = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});

const chatNode = async (state) => {
  const response = await model.invoke(state.messages);

  return {
    messages: [response],
  };
};

const builder = new StateGraph(MessagesAnnotation)
  .addNode("chat", chatNode)
  .addEdge(START, "chat")
  .addEdge("chat", END);

let chatGraphPromise;

export const getChatGraph = async () => {
  if (!chatGraphPromise) {
    chatGraphPromise = (async () => {
      const checkpointer = await getCheckpointer();

      return builder.compile({
        checkpointer,
      });
    })().catch((error) => {
      chatGraphPromise = undefined;
      throw error;
    });
  }

  return chatGraphPromise;
};
