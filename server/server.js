console.log("App starting...");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", aiRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});