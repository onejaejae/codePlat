import "./db";
import dotenv from "dotenv";
import app from "./app";

import "./models/Comment";
import "./models/Like";
import "./models/Post";
import "./models/Scrap";
import "./models/User";

import("@babel/register");

dotenv.config({ path: ".env" });

const handleListening = () => {
  console.log(`Listening`);
};

app.listen(80, handleListening);
