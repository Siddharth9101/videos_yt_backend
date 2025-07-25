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
import videoRoutes from "./routes/video.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";

// route declarations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);

export { app };
