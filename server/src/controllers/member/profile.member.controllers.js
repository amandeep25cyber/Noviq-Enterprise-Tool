import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Task } from "../../models/task.models.js";
import { User } from "../../models/user.models.js";
import { Project } from "../../models/project.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";


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

    let updateData = req.body;
    const filePathName = req.file?.path;

    if(!userId){
        if(filePathName) fs.unlinkSync(filePathName);
        throw new ApiError(401,"Unauthorized user!");
    }

    if(!updateData?.name){
        if(filePathName) fs.unlinkSync(filePathName);
        throw new ApiError(400,"Full name is must.");
    }

    const existedUser = await User.findById(userId);

    if(!existedUser){
        if(filePathName) fs.unlinkSync(filePathName);
        throw new ApiError(401,"User does not exists.");
    }

    if(filePathName){
        const response = await uploadOnCloudinary(filePathName);
        if(response && response.secure_url){
            updateData.avatar = response.secure_url;
            if (existedUser.avatar) {
                try {
                    const publicId = existedUser.avatar.split('/').at(-1).split('.')[0];
                    await deleteFromCloudinary(publicId, "image");
                } catch (error) {
                    console.log("Error deleting old avatar from cloudinary:", error);
                }
            }
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: updateData,
        },
        {
            new: true,
            runValidators: true,
        }
    )
    .select("name phoneNo bio avatar");

    if(!user){
        throw new ApiError(500,"Something went wrong while updating profile details.")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, user, "User updated successfully.")
    )
})

const changePasswordController = asyncHandler(async(req,res)=>{
    const { oldPassword, newPassword, confirmNewPassword} = req.body;
    const userId = req.user?._id;
    const orgId = req.user?.organisation;

    if(!oldPassword || !newPassword || !confirmNewPassword){
        throw new ApiError(401,"Invalid Credentials.")
    }

    if(newPassword !== confirmNewPassword){
        throw new ApiError(401, "New password is not matching with confirm new password.")
    }

    const existedUser = await User.findOne({_id: userId, organisation: orgId}).select("+password");

    if(!existedUser){
        throw new ApiError(403, "User doesn't exists.");
    }

    const isPasswordMatched = await existedUser.isPasswordCorrect(oldPassword);

    if(!isPasswordMatched){
        throw new ApiError(403, "Password is incorrect.")
    }

    existedUser.password = newPassword;

    existedUser.save({
        runValidators: true,
    })

    res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password Changed!")
    )
})

export {
    userStatsWithDetails,
    updateUserProfile,
    changePasswordController,
}