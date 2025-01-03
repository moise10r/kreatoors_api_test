// src/auth/auth.module.ts
import { Router } from "express";
import { AuthRouter } from "./auth.routes";

export class AuthModule {
  public router: Router;

  constructor() {
    const authRouter = new AuthRouter();
    this.router = authRouter.router;
  }
}
