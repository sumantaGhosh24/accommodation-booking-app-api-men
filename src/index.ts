import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import connectDB from "./lib/connectDB";
import corsOptions from "./lib/corsOptions";
import userRoutes from "./routes/userRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import hotelRoutes from "./routes/hotelRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(fileUpload({useTempFiles: true}));

app.get("/", (req, res) => {
  res.json({message: "API Working!"});
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", hotelRoutes);
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", ratingRoutes);
app.use("/api/v1", dashboardRoutes);

mongoose.connection.once("open", async () => {
  console.log("Database connection successful!");

  app.listen(PORT, () => {
    console.log(`Application running on http://localhost:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
