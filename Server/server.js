import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

//db connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB database is connected successfully !!");
  } catch (err) {
    console.log(err);
  }
};



//middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);





//test
app.get("/", (req, res) => {
  res.send("ChatApp Server is running successfully");
});



app.listen(PORT, () => {
  connect();
  console.log(`Server is running on ${PORT} successfully ;)`);
});
