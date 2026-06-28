console.log("🔥 APP STARTING...");

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ PROMISE ERROR:", err);
});

import express from "express";

const app = express();

console.log("✔ Express loaded");

app.get("/", (req, res) => {
  res.send("WORKING OK");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on", PORT);
});