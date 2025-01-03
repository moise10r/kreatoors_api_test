import User, { IUser } from "../user/user.model";
import Logger from "../common/logger/logger";
import { NotFoundError, ValidationError } from "../common/error/error";

export class UserService {
  public async getProfile(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      Logger.error(`User with ID ${userId} not found.`);
      throw new NotFoundError("User not found");
    }
    return user;
  }

  public async updateProfile(userId: string, updateData: any): Promise<IUser> {
    if (!updateData.username && !updateData.email) {
      throw new ValidationError(
        "At least one of username or email must be provided"
      );
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      Logger.error(`User with ID ${userId} not found for update.`);
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
