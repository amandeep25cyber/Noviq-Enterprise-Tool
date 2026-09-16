import {Router} from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import { createNewUser, createProject, createTask, deleteProject, deleteTask, getAllUser, getDashboardStats, getDashboardTeamPerformance, getFilesController, getOrgUsers, getProjects, getProjectsStat, getSingleProject, updateProject, updateTaskStatus } from "../controllers/organisation/user.organisation.js";

const router = Router();

router.route('/user').post(verifyUser,isAdmin,createNewUser)
router.route('/users').get(verifyUser,isAdmin,getAllUser)
router.route('/dashboard/stats').get(verifyUser,isAdmin,getDashboardStats)
router.route('/dashboard/team-performance').get(verifyUser,isAdmin,getDashboardTeamPerformance)
router.route('/projects').get(verifyUser,isAdmin,getProjects);
router.route('/projects/stats').get(verifyUser,isAdmin,getProjectsStat);
router.route('/project').post(verifyUser,isAdmin,createProject);
router.route('/org-users').get(verifyUser,isAdmin,getOrgUsers);
router.route('/project/:projectId').get(verifyUser,isAdmin,getSingleProject);
router.route('/project/:projectId').put(verifyUser,isAdmin,updateProject);
router.route('/project/:projectId').delete(verifyUser,isAdmin,deleteProject);
router.route('/task').post(verifyUser,isAdmin,createTask);
router.route('/task/:taskId/status').put(verifyUser,isAdmin,updateTaskStatus);
router.route('/task/:taskId').delete(verifyUser,isAdmin,deleteTask);
router.route('/file/:projectId').get(verifyUser,isAdmin,getFilesController);

export default router;