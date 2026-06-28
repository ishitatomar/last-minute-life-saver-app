console.log("App starting...");
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

//import "./firebase/firebaseAdmin.js";
import aiRoutes from "./routes/aiRoutes.js";

console.log(
  "OpenRouter Key:",
  process.env.OPENROUTER_API_KEY ? "Loaded ✅" : "Missing ❌"
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Last Minute Life Saver Backend Running");
});

app.use("/api", aiRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});