import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import Logger from "./common/logger/logger";
import { morganMiddleware } from "./common/middlewares";
import { DeviceModule } from "./device/device.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import swaggerUi from "swagger-ui-express";
import yamljs from "yamljs";

class AppModule {
  private app: express.Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.configureMiddlewares();
    this.configureRoutes();
    this.connectDatabase();
  }

  private configureMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(morganMiddleware);
  }

  private configureRoutes(): void {
    const authModule = new AuthModule();
    const userModule = new UserModule();
    const deviceModule = new DeviceModule();

    const swaggerDocument = yamljs.load("./swagger.yaml");
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    this.app.use("/api/auth", authModule.router);
    this.app.use("/api/user", userModule.router);
    this.app.use("/api/device", deviceModule.router);
  }

  private async connectDatabase(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      Logger.debug("MongoDB connected successfully");
      this.startServer();
    } catch (err) {
      Logger.error(`Database connection failed: ${err}`);
    }
  }

  private startServer(): void {
    this.app.listen(this.port, () => {
      Logger.debug(`Server running on port ${this.port}`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default AppModule;
