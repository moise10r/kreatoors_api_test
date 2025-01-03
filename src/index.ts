import express, { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const router = Router();

router.get("/", (req, res) => {
  res.send({ message: "WELCOME" });
});

app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
