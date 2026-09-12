import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Task } from "../../models/task.models.js";
import { User } from "../../models/user.models.js";
import { Project } from "../../models/project.models.js";

const userStatsWithDetails = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const orgId = req.user?.organisation;

    const [user, completedTasks, todoTasks, inProgressTasks, projects] = await Promise.all([
        User.findById(userId).select("name email phoneNo jobRole bio avatar status isBlocked createdAt").lean(),
        
        Task.countDocuments({
            organisation: orgId,
            assignedTo: userId,
            status: "done"
        }),

        Task.countDocuments({
            organisation: orgId,
            assignedTo: userId,
            status: "todo"
        }),

        Task.countDocuments({
            organisation: orgId,
            assignedTo: userId,
            status: "in-progress"
        }),

        Project.find({
            organisation: orgId,
            members: userId,
        }).select("title").lean()

    ]);

    if(!user){
        throw new ApiError(403,"User doesn't exists.");
    }

    const modifiedUser = {
        ...user,
        completedTasks,
        todoTasks,
        inProgressTasks,
        projects,
        activeTasks: todoTasks + inProgressTasks
    }
    res
    .status(200)
    .json(
        new ApiResponse(200, modifiedUser, "Fetched successfully.")
    )
})

const updateUserProfile = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const orgId = req.user?.organisation;

    const { name, phoneNo, bio } = req.body;

    if(!userId){
        throw new ApiError(401,"Unauthorized user!");
    }

    if(!name){
        throw new ApiError(402,"Full name is must.");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set:{ name: name, phoneNo: phoneNo, bio: bio}
        },
        {
            new: true,
            runValidators: true,
        }
    )
    .select("name phoneNo bio");

    if(!user){
        throw new ApiError(500,"Something went wrong while updating profile details.")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, user, "User updated successfully.")
    )
})

export {
    userStatsWithDetails,
    updateUserProfile,
}