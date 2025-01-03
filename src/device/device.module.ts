import { Router } from "express";
import { DeviceRouter } from "./device.routes";

export class DeviceModule {
  public router: Router;

  constructor() {
    const deviceRouter = new DeviceRouter();
    this.router = deviceRouter.router;
  }
}
