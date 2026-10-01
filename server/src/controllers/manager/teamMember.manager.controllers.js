import { Project } from "../../models/project.models.js";
import { User } from "../../models/user.models.js";
import { Task } from "../../models/task.models.js"
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js"
import { ApiError } from "../../utils/ApiError.js";

const getUsersData = asyncHandler(async (req,res)=>{
    const userId = req.user._id;
    const orgId = req.user.organisation;

    const projects = await Project.find({
        $or:[
            { createdBy: userId },
            { members: userId }
        ],
        organisation: orgId
    })

    const uniqueMembers = new Set();

    projects.forEach(project => {

        uniqueMembers.add(project.createdBy.toString());
        if (project.members && project.members.length > 0) {
            project.members.forEach(memberId => uniqueMembers.add(memberId.toString()));
        }
    });

    const users = await User.find({
        organisation: orgId,
        _id: { 
            $in: [...uniqueMembers],
            $ne: userId
        },
        role: { $in:[ "manager","member"]}
    })
    .select("name avatar email role status jobRole")
    .lean();

    const updatedFieldUser = await Promise.all(
        users.map(async(user)=>{
            const activeTasks = await Task.countDocuments({
                organisation: orgId,
                assignedTo: user._id,
                status: { $in: ["todo","in-progress"]}
            })

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const completedLast30Days = await Task.countDocuments({
                assignedTo: user._id,
                organisation: orgId,
                status: "done",
                updatedAt: { $gte: thirtyDaysAgo } 
            });

            const startOfWeek = new Date();
            const currentDay = startOfWeek.getDay();
            
            const diff = startOfWeek.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
            
            startOfWeek.setDate(diff);
            startOfWeek.setHours(0, 0, 0, 0);

            const completedThisWeek = await Task.countDocuments({
                assignedTo: user._id,
                organisation: orgId,
                status: "done",
                updatedAt: { $gte: startOfWeek } 
            });

            const projects = await Project.find({
                organisation: orgId,
                $or: [
                    { createdBy: user._id },
                    { members: user._id }
                ],
                status: { $ne: "Completed"}
            }).select("title status");

            return {
                ...user,
                activeTasks,
                completedLast30Days,
                completedThisWeek,
                projects
            }
        })
    )

    res
    .status(200)
    .json(
        new ApiResponse(200,updatedFieldUser,"User's data is fetched successfully")
    )
})

const updateJobRole = asyncHandler(async(req,res)=>{
  
    const { userId } = req.params;
    const { jobRole } = req.body;

    if(!["Trainee","Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer", "Designer", "Senior Frontend Developer", "Senior Backend Developer"].includes(jobRole)){
        throw new ApiError(400,"Choose valid job role.")
    }

    const user = await User.findOneAndUpdate(
        { 
            _id: userId,
            organisation: req.user?.organisation
        },
        { $set: { "jobRole": jobRole}},
        { new: true}
    )

    res
    .status(200)
    .json(
        new ApiResponse(200,{ jobRole: user.jobRole, _id: user._id }, "Job Role Updated Successfully")
    )
})

export {
    getUsersData,
    updateJobRole,
}
