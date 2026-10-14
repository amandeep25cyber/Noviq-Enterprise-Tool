import { Router } from "express";
import { directMessageController, getDirectMessageController, getProjectMessageController, getSidebarMembers, projectMessageController } from "../controllers/shared/chat.controllers.js";
import { verifyUser } from "../middlewares/verifyJWT.js";

const router = Router();

router.route('/direct-message').post(verifyUser,directMessageController);
router.route('/direct-message/:recId').get(verifyUser,getDirectMessageController);
router.route('/team-members').get(verifyUser,getSidebarMembers);
router.route('/project-message').post(verifyUser,projectMessageController);
router.route('/project-message/:projectId').get(verifyUser,getProjectMessageController);

export default router;