import { AuthController } from "./auth.controller";
import { BaseRouter } from "../common/routes/base.router";

export class AuthRouter extends BaseRouter {
  private authController = new AuthController();

  constructor() {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post("/register", this.authController.register);
    this.router.post("/login", this.authController.login);
  }
}
