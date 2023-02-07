import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import {
  bookingRouter,
  hotelRouter,
  ratingRouter,
  userRouter,
  categoryRouter,
  paymentRouter,
} from "./routers/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cors({origin: ["http://localhost:3000"]}));
app.use(morgan("dev"));
app.use(cookieParser());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, (err) => {
  if (err) throw err;
  console.log("database connection successful.");
});

app.use("/api", bookingRouter);
app.use("/api", hotelRouter);
app.use("/api", ratingRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", paymentRouter);

app.listen(PORT, () => {
  console.log(`application listening on http://localhost:${PORT}`);
});
