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
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import likeRoutes from "./routes/like.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";

// route declarations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/tweets", tweetRoutes);

export { app };
