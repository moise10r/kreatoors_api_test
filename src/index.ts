import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import Logger from "./common/logger/logger";
import authRouter from "./auth/auth.module";
import userRouter from "./user/user.module";
import deviceRouter from "./device/device.module";
import { errorHandler, morganMiddleware } from "./common/middlewares";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morganMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/devices", deviceRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => Logger.debug(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
