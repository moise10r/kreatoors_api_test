import { BaseRouter } from "../common/routes/base.router";
import { DeviceController } from "./device.controller";

export class DeviceRouter extends BaseRouter {
  private deviceController = new DeviceController();

  constructor() {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get("/", this.deviceController.getDevices);
    this.router.post("/logout", this.deviceController.logoutDevice);
  }
}
