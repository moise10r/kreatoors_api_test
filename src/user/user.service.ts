import User, { IUser } from "../user/user.model";
import Logger from "../common/logger/logger";
import { NotFoundError } from "../common/error/error";
import { upload } from "../common/middlewares";

export class UserService {
  public async getProfile(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      Logger.error(`User with ID ${userId} not found.`);
      throw new NotFoundError("User not found");
    }
    return user;
  }

  public async updateProfile(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      Logger.error(`User with ID ${userId} not found for update.`);
      throw new NotFoundError("User not found");
    }

    return user;
  }

  public async saveProfileImage(
    userId: string,
    file: Express.Multer.File
  ): Promise<IUser> {
    try {
      const profileImageUrl = `/uploads/${file.filename}`;

      const user = await User.findById(userId);
      if (!user) {
        Logger.error(`User with ID ${userId} not found.`);
        throw new NotFoundError("User not found");
      }

      user.profileImage = profileImageUrl;
      await user.save();

      return user;
    } catch (err) {
      Logger.error(
        `Error saving profile image for user with ID ${userId}: ${err}`
      );
      throw err;
    }
  }
}
