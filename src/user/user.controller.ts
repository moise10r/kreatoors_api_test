import { Request, Response } from "express";
import Logger from "../common/logger/logger";
import { NotFoundError, ValidationError } from "../common/error/error";
import { UserService } from "./user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const user = await this.userService.getProfile(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ errorCode: "USER_NOT_FOUND", message: "User not found" });
      }
    } catch (err) {
      Logger.error(err);
      if (err instanceof NotFoundError) {
        res
          .status(404)
          .json({ errorCode: err.errorCode, message: err.message });
      } else {
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }
  };

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const updateData = req.body;

      const updatedUser = await this.userService.updateProfile(
        userId,
        updateData
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      Logger.error(err);
      if (err instanceof ValidationError) {
        res
          .status(400)
          .json({ errorCode: err.errorCode, message: err.message });
      } else if (err instanceof NotFoundError) {
        res
          .status(404)
          .json({ errorCode: err.errorCode, message: err.message });
      } else {
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }
  };
}
