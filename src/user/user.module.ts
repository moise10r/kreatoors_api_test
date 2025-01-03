import { Router } from "express";
import { UserRouter } from "./user.routes";

export class UserModule {
  public router: Router;

  constructor() {
    const userRouter = new UserRouter();
    this.router = userRouter.router;
  }
}
