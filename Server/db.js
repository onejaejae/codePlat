import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(
    process.env.NODE_ENV === "production"
      ? process.env.mongoURI
      : process.env.DB_HOST,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log(err));

mongoose.set("useCreateIndex", true);
