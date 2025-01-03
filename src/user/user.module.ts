import { Router } from "express";
import { UserController } from "./user.controller";

const userController = new UserController();

const router = Router();

router.get("/:userId", userController.getProfile);
router.patch("/:userId", userController.updateProfile);
export default router;
