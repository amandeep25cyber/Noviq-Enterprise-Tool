import { Router } from "express";
import { directMessageController, getDirectMessageController } from "../controllers/shared/chat.controllers.js";
import { verifyUser } from "../middlewares/verifyJWT.js";

const router = Router();

router.route('/direct-message').post(verifyUser,directMessageController);
router.route('/direct-message/:recId').get(verifyUser,getDirectMessageController);

export default router;