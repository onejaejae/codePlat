import "./db";
import dotenv from "dotenv";
import app from "./app";

import "./models/Comment";
import "./models/Like";
import "./models/Post";
import "./models/Scrap";
import "./models/User";

dotenv.config();

const PORT = process.env.SERVER_PORT || 4000;

const handleListening = () => {
  console.log(`Listening on http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
