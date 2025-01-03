import { Request, Response } from "express";
import Logger from "../common/logger/logger";
import { NotFoundError, ValidationError } from "../common/error/error";
import { UserService } from "./user.service";
import { upload } from "../common/middlewares";
import { IUser } from "./user.model";

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

  public uploadProfileImage = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    upload.single("profileImage")(req, res, async (err: any) => {
      if (err) {
        Logger.error(`Error uploading file: ${err}`);
        return res
          .status(400)
          .json({ errorCode: "UPLOAD_ERROR", message: "Error uploading file" });
      }

      const { userId } = req.params;

      try {
        const updatedUser: IUser = await this.userService.saveProfileImage(
          userId,
          req.file!
        );
        res.status(200).json({
          message: "Profile image uploaded successfully",
          user: updatedUser,
        });
      } catch (err) {
        Logger.error(`Error updating user profile: ${err}`);
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    });
  };
}
