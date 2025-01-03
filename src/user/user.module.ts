import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../common/middlewares";

const userController = new UserController();

const router = Router();

router.get("/:userId", authenticate, userController.getProfile);
router.patch("/:userId", authenticate, userController.updateProfile);
export default router;
