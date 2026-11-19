import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/user.model.js";

async function addCredits() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const amount = parseInt(process.argv[2], 10) || 1000;

  const result = await User.updateMany({}, { $set: { credits: amount } });
  console.log(`Updated ${result.modifiedCount} user(s) to ${amount} credits.`);

  const users = await User.find({}, "name email credits");
  console.log("Current Users:", users.map(u => ({ email: u.email, credits: u.credits })));

  await mongoose.disconnect();
  console.log("Done.");
}

addCredits().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
