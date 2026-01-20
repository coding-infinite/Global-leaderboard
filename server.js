import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "./data.json";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* Read data */
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

/* Write data */
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* Home */
app.get("/", (req, res) => {
  res.send("Leaderboard API is running 🚀");
});

/* Register / Update player */
app.post("/register", (req, res) => {
  const { username, score, country } = req.body;

  if (!username || score === undefined || !country) {
    return res.status(400).json({
      error: "username, score and country are required"
    });
  }

  let data = readData();

  const existing = data.find(p => p.username === username);

  if (existing) {
    if (score > existing.score) {
      existing.score = score;
    }
    existing.country = country;
  } else {
    data.push({ username, score, country });
  }

  data.sort((a, b) => b.score - a.score);
  writeData(data);

  res.json({ success: true });
});

/* Get leaderboard */
app.get("/leaderboard", (req, res) => {
  res.json(readData());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
