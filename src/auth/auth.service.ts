// services/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user/user.model";
import Logger from "../common/logger/logger";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../common/error/error";

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
  public async register(
    username: string,
    email: string,
    password: string
  ): Promise<string> {
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

    return token;
  }

  public async login(
    email: string,
    password: string,
    deviceId: string,
    deviceName: string
  ): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      Logger.error(`User with email ${email} not found.`);
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      Logger.error(`Invalid password attempt for email ${email}.`);
      throw new UnauthorizedError("Invalid credentials");
    }

    // Track user device
    user.devices.push({ deviceId, deviceName, lastUsed: new Date() });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    return token;
  }
}
