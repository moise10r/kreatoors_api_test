import { Request, Response } from "express";
import Logger from "../common/logger/logger";
import { NotFoundError } from "../common/error/error";
import { DeviceService } from "./device.service";
import { Device } from "../user/user.model";

interface CustomRequest extends Request {
  user?: { id: string };
}

export class DeviceController {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  public getDevices = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res
          .status(401)
          .json({ message: "Unauthorized: User not authenticated" });
        return;
      }

      const devices: Device[] = await this.deviceService.getDevices(
        req.user.id
      );
      res.status(200).json(devices);
    } catch (err) {
      Logger.error(err);
      if (err instanceof NotFoundError) {
        res
          .status(404)
          .json({ errorCode: err.errorCode, message: err.message });
      } else {
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }
  };

  public logoutDevice = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res
          .status(401)
          .json({ message: "Unauthorized: User not authenticated" });
        return;
      }

      const { deviceId }: { deviceId: string } = req.body;
      await this.deviceService.logoutDevice(req.user.id, deviceId);
      res.status(200).json({ message: "Device logged out" });
    } catch (err) {
      Logger.error(err);
      if (err instanceof NotFoundError) {
        res
          .status(404)
          .json({ errorCode: err.errorCode, message: err.message });
      } else {
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }
  };
}
