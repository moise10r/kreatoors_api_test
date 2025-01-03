import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Logger from "../lib/logger";
import { UnauthorizedError, ValidationError } from "../config/error";

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ValidationError("Username, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedError("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    Logger.error(err);

    if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({ errorCode: err.errorCode, message: err.message });
    } else if (err instanceof UnauthorizedError) {
      return res
        .status(409)
        .json({ errorCode: err.errorCode, message: err.message });
    }

    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};
