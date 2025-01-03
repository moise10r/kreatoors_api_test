import { BaseRouter } from "../common/routes/base.router";
import { UserController } from "./user.controller";

export class UserRouter extends BaseRouter {
  private userController = new UserController();

  constructor() {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get("/:userId", this.userController.getProfile);
    this.router.patch("/:userId", this.userController.updateProfile);
  }
}
