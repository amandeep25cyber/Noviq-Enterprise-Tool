import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isMember } from "../middlewares/isMember.js";
import { getDashboardStats, getTodaysTasks, logTaskTime } from "../controllers/member/dashboard.member.js";
import { getUserTasks } from "../controllers/member/Taskboard.member.js";
import { getFilesController } from "../controllers/member/files.member.controllers.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isMember,getDashboardStats);
router.route('/todays-tasks').get(verifyUser,isMember,getTodaysTasks);
router.route('/log-time').put(verifyUser,isMember,logTaskTime);
router.route('/tasks').get(verifyUser,isMember,getUserTasks);
router.route('/files').get(verifyUser,isMember,getFilesController);

export default router;