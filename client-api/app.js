import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

//app setup
const app = express();
const port = process.env.PORT || 3000;

//API security
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Redis connection
import { connectRedis } from "./src/helper/redis.helper.js";
connectRedis();

//MongoDB connection
import mongoose from "mongoose";

if (process.env.MONGODB_URL) {
  mongoose.connect(process.env.MONGODB_URL);
} else {
  console.warn("⚠️ MONGODB_URL is not defined in .env! Database features will not work.");
}

if (process.env.NODE_ENV !== "production") {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose is connected");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  //Logger
  app.use(morgan("combined"));
}

//Load routers
import userRouter from "./src/routers/user.router.js";
import ticketRouter from "./src/routers/ticket.router.js";
import tokenRouter from "./src/routers/token.router.js";

//Use routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/token", tokenRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "CRM API is running!",
    endpoints: {
      user: "/v1/user",
      ticket: "/v1/ticket",
      token: "/v1/token"
    }
  });
});

//Error Handler
import errorHandler from "./src/utils/errorHandler.js";

app.use((req, res, next) => {
  const error = new Error("Resource not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  errorHandler(error, res);
});

app.listen(port, () => console.log(`API is ready on http://localhost:${port}`));
