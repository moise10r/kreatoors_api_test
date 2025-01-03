import express, { Router } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Logger from "./lib/logger";
import morganMiddleware from "./config/morganMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morganMiddleware);
const router = Router();

router.get("/", (req, res) => {
  res.send({ message: "WELCOME" });
});

app.use("/api", router);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => Logger.debug(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
