import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import Logger from "../lib/logger";

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    Logger.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
};
