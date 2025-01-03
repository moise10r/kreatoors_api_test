import { Router } from "express";
import { DeviceController } from "./device.controller";
import { authenticate } from "../common/middlewares";

const deviceController = new DeviceController();

const router = Router();

router.get("/", authenticate, deviceController.getDevices);
router.post("/logout", authenticate, deviceController.logoutDevice);
export default router;
