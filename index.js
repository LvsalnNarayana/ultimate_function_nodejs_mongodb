import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";

import { sessionMiddleware } from "./middleware/sessionMiddleware.js";
import connectDB from "./utils/connectDB.js";
import v1Router from "./routes/v1/index.js";
import { config } from "./config/config.js";
import corsConfig from "./config/cors.js";
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use("/v1", v1Router);
app.use((err, req, res, next) => {
  const statusCode = res?.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    stack: config.environment === "development" ? err.stack : null,
    message: err.message,
  });
});

server.listen(config?.port, () => {
  console.log(`Server running on http://localhost:${config?.port}`);
});
