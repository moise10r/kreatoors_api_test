// controllers/auth.controller.ts
import { Request, Response } from "express";
import Logger from "../common/logger/logger";
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from "../common/error/error";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dtos/createUser.dto";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password }: CreateUserDto = req.body;

      const token = await this.authService.register(username, email, password);

      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      Logger.error(err);

      if (err instanceof UnauthorizedError) {
        res
          .status(409)
          .json({ errorCode: err.errorCode, message: err.message });
      } else if (err instanceof ValidationError) {
        res
          .status(400)
          .json({ errorCode: err.errorCode, message: err.message });
      } else {
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, deviceId, deviceName } = req.body;

      const token = await this.authService.login(
        email,
        password,
        deviceId,
        deviceName
      );

      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(200).json({ message: "Login successful" });
    } catch (err) {
      if (err instanceof NotFoundError || err instanceof UnauthorizedError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        Logger.error(err);
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  };
}
