import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { TRANSFER_LIMIT } from "./constants.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: TRANSFER_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: TRANSFER_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// route imports
import userRoutes from "./routes/user.route.js";

// route declarations
app.use("/api/v1/users", userRoutes);

export { app };
