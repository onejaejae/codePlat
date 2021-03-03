import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

const handleOpen = () => console.log("🙌 Connected to DB");
const handleError = (error) =>
  console.log(`❌ Error on DB Connection : ${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
