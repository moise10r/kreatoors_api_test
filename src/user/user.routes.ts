import { authenticate } from "../common/middlewares";
import { BaseRouter } from "../common/routes/base.router";
import { UserController } from "./user.controller";

export class UserRouter extends BaseRouter {
  private userController = new UserController();

  constructor() {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get("/:userId", authenticate, this.userController.getProfile);
    this.router.patch(
      "/:userId",
      authenticate,
      this.userController.updateProfile
    );
    this.router.patch(
      "/upload/:userId",
      authenticate,
      this.userController.uploadProfileImage
    );
  }
}
