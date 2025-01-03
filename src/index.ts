import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import Logger from "./common/logger/logger";
import morganMiddleware from "./common/middlewares/morgan.middleware";
import authRouter from "./auth/auth.module";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morganMiddleware);

app.use("/api", authRouter);
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => Logger.debug(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
