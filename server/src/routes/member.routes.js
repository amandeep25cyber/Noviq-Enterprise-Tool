import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isMember } from "../middlewares/isMember.js";
import { getDashboardStats, getTodaysTasks, logTaskTime } from "../controllers/member/dashboard.member.js";
import { getUserTasks } from "../controllers/member/Taskboard.member.js";
import { deleteFile, getFilesController, getUserInvolvedProjects, uploadFileforMemberController } from "../controllers/member/files.member.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js"
import { changePasswordController, updateUserProfile, userStatsWithDetails } from "../controllers/member/profile.member.controllers.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isMember,getDashboardStats);
router.route('/todays-tasks').get(verifyUser,isMember,getTodaysTasks);
router.route('/log-time').put(verifyUser,isMember,logTaskTime);
router.route('/tasks').get(verifyUser,isMember,getUserTasks);
router.route('/files').get(verifyUser,isMember,getFilesController);
router.route('/projects').get(verifyUser,isMember,getUserInvolvedProjects);
router.route('/file').post(verifyUser,isMember,upload.single("file"),uploadFileforMemberController);
router.route('/file/:fileId').delete(verifyUser,isMember,deleteFile);
router.route('/profile').get(verifyUser,isMember,userStatsWithDetails);
router.route('/profile').put(verifyUser,isMember,upload.single("avatar"),updateUserProfile);
router.route('/password').put(verifyUser,isMember,changePasswordController);

export default router;