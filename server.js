import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";

const app = express();
dotenv.config();
dbConnect();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the App" });
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
