import { asyncHandler } from "../../utils/AsyncHandler.js"
import { Project } from "../../models/project.models.js"
import { Task } from "../../models/task.models.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { ApiError } from "../../utils/ApiError.js"
import { User } from "../../models/user.models.js"
import fs from "fs";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";
import { File } from "../../models/file.models.js"

const managerProjects = asyncHandler(async(req,res)=>{
    
    const userId = req.user._id;
    const orgId = req.user.organisation;

    const projects = await Project.find({
        organisation: orgId,
        $or:[
            { createdBy: userId },
            { members: userId }
        ]
    })
    .select("title description status deadline members taskCount priority health")
    .populate("members","name avatar")
    .lean();

    if (!projects.length) {
        return res.status(200).json([]);
    }

    const projectIds = projects.map(project => project._id);

    const completedTasksData = await Task.aggregate([
        {
            $match: {
                project: { $in: projectIds },
                organisation: orgId,
                status: "done"
            }
        },
        {
            $group: {
                _id: "$project",
                completedCount: { $sum: 1 }
            }
        }
    ]);

    // Create a dictionary : { "projectId": count }
    const completedTasksMap = completedTasksData.reduce((acc, curr) => {
        acc[curr._id.toString()] = curr.completedCount;
        return acc;
    }, {});

    const updatedProjects = projects.map(project => {
        
        const completedTask = completedTasksMap[project._id.toString()] || 0;
        
        const pendingTask = Math.max(0, project.taskCount - completedTask);
        
        const progress = project.taskCount > 0 
            ? Math.round((completedTask / project.taskCount) * 100) 
            : 0;

        return {
            ...project,
            progress,
            tasks: { 
                total: project.taskCount,
                completed: completedTask, 
                pending: pendingTask 
            }
        };
    });

    res
    .status(200)
    .json(
        new ApiResponse( 200, updatedProjects, "fetched successfully")
    )
});

const getAllUsers = asyncHandler(async (req, res) => {
    
    const orgId = req.user.organisation;
    
    // Agar frontend ne koi specific role manga hai (like ?role=manager)
    const { role } = req.query; 

    const query = { organisation: orgId };
    if (role) {
        query.role = role;
    }

    const users = await User.find(query)
        .select("name email role avatar")
        .sort({ createdAt: -1 }); // Naye users upar dikhein

    return res.status(200).json(
        new ApiResponse(200, users, "Organisation users fetched successfully")
    );
});

const createNewProject = asyncHandler(async(req,res)=>{

    const { title, description, status, health, deadline, members } = req.body;
    
    if (!title) {
        throw new ApiError(400, "Project title is required");
    }

    // 2. Organization cross-check (Optional but highly recommended)
    // Agar frontend ne members bheje hain, toh ensure karo sab same org ke hain
    if (members && members.length > 0) {
        const validMembers = await User.countDocuments({
            _id: { $in: members },
            organisation: req.user.organisation // Token se aayi Org ID
        });
        
        if (validMembers !== members.length) {
            throw new ApiError(403, "Some members do not belong to your organisation");
        }
    }

    const newProject = await Project.create({
        organisation: req.user.organisation, 
        createdBy: req.user._id,          
        title,
        description,
        status: status || "Planning",
        health: health || "Good",
        deadline,
        members: members || []
    });

    return res.status(201).json(
        new ApiResponse(201,newProject,"Project created Successfully")
    );
})

const updateExistedProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, status, health, deadline, members } = req.body;
    const orgId = req.user.organisation;

    if (members && members.length > 0) {
        const validMembers = await User.countDocuments({
            _id: { $in: members },
            organisation: orgId
        });
        
        if (validMembers !== members.length) {
            throw new ApiError(403, "Some members do not belong to your organisation");
        }
    }

    const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, organisation: orgId },
        { 
            $set: { title, description, status, health, deadline, members } 
        }, 
        { new: true, runValidators: true }
    );

    if (!updatedProject) {
        throw new ApiError(404, "Project not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    );
});

const deleteManagerProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const orgId = req.user.organisation;

    const deletedProject = await Project.findOneAndDelete({ 
        _id: projectId, 
        organisation: orgId 
    });

    if (!deletedProject) {
        throw new ApiError(404, "Project not found or access denied");
    }

    // Database Cleanup: Is project ke saare tasks bhi delete kar do
    await Task.deleteMany({ project: projectId });

    return res.status(200).json(
        new ApiResponse(200, {}, "Project and its associated tasks deleted successfully")
    );
});

const getProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const orgId = req.user.organisation;

    const project = await Project.findOne({ 
        _id: projectId, 
        organisation: orgId 
    }).populate("members", "name email avatar jobRole")
      .populate("createdBy", "name avatar");

    if (!project) {
        throw new ApiError(404, "Project not found or you don't have access");
    }

    const tasks = await Task.find({ project: projectId })
        .populate("assignedTo", "name avatar") 
        .sort({ createdAt: -1 });

    // Kanban Board ke liye Tasks ko format karna
    const formattedTasks = {
        todo: tasks.filter(task => task.status === "todo"),
        inProgress: tasks.filter(task => task.status === "in-progress"),
        done: tasks.filter(task => task.status === "done")
    };

    return res.status(200).json(
        new ApiResponse(200, { 
            project, 
            tasks: formattedTasks
        }, "Project details and tasks fetched successfully")
    );
});

const updateTaskStatusById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body; 
    const orgId = req.user.organisation;

    const allowedStatuses = ["todo", "in-progress", "done"];
    if (!status || !allowedStatuses.includes(status)) {
        throw new ApiError(400, "Invalid or missing task status");
    }

    const task = await Task.findById(taskId).populate("project");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (task.project.organisation.toString() !== orgId.toString()) {
        throw new ApiError(403, "Access denied. Task belongs to another organisation.");
    }

    task.status = status;
    await task.save();

    return res.status(200).json(
        new ApiResponse(200, { taskId: task._id, status: task.status }, "Status updated successfully")
    );
});

const createNewTask = asyncHandler(async (req, res) => {
    const { title, description, priority, status, assignedTo, project, tags, deadline } = req.body;
    const orgId = req.user.organisation;

    if (!title || !project) {
        throw new ApiError(400, "Title and Project ID are required");
    }

    const existingProject = await Project.findOne({ 
        _id: project, 
        organisation: orgId 
    });

    if (!existingProject) {
        throw new ApiError(403, "Project not found or you don't have access");
    }

    let finalAssignee = null;
    
    if (assignedTo && assignedTo !== "Unassigned") {
        const memberIds = existingProject.members.map(memberId => memberId.toString());
        
        if (!memberIds.includes(assignedTo.toString())) {
            throw new ApiError(400, "Assigned user is not a member of this project!");
        }
        
        finalAssignee = assignedTo; 
    }

    let parsedTags = [];
    if (tags) {
        parsedTags = typeof tags === 'string' ? tags.split(",").map(tag => tag.trim()) : tags;
    }

    const newTask = await Task.create({
        title,
        description,
        organisation:orgId,
        assignedTo: finalAssignee, 
        project,
        priority: priority || "low",
        status: status || "todo",
        tags: parsedTags,
        createdBy: req.user._id,
        deadline
    })

    const task = await Task.findById(newTask._id)
    .select("title description deadline status tags priority")
    .populate("project","title")
    .populate("assignedTo","name avatar");

    existingProject.taskCount += 1;
    await existingProject.save();

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    );
});

const uploadFileController = asyncHandler(async(req,res)=>{
    // (project,organisation,uploadedBy,fileName,fileUrl,fileType,size,publicId)Modal requirement
    const { project, fileName, fileType } = req.body;
    const uploadedBy = req.user._id;
    const orgId = req.user.organisation;

    const filePathName = req.file?.path;
    const size = req.file?.size;

    if(!filePathName){
        throw new ApiError(400,"File is Missing.")
    }

    if(!project || !fileName){
        fs.unlinkSync(filePathName);
        throw new ApiError(401,"Project ID and File name is must.");
    }

    const allowedCategories = ['design', 'document', 'spreadsheet', 'image'];
    if (!allowedCategories.includes(fileType)) {
        fs.unlinkSync(filePathName);
        throw new ApiError(400,"Invalid file category selected")
    }

    const response = await uploadOnCloudinary(filePathName);

    if(!response){
        throw new ApiError(500,"Something went wrong while uploading to Cloudinary.")
    }

    const file = await File.create({
        organisation: orgId,
        project,
        uploadedBy,
        fileName,
        fileType,
        fileUrl: response?.secure_url || "",
        size,
        publicId: response?.public_id,
        resourceType: response?.resource_type || "image"
    })

    if(!file){
        await deleteFromCloudinary( response?.public_id, response?.resource_type);
        throw new ApiError(500,"Something went wrong with database.");
    }

    const createdFile = await File.findById(file?._id).select("fileName uploadedBy fileUrl fileType createdAt size").populate("uploadedBy","name avatar").lean();

    res
    .status(201)
    .json(
        new ApiResponse(201,createdFile,"File uploaded")
    )

})

const getProjectFilesController = asyncHandler(async(req,res)=>{
    
    const orgId = req.user?.organisation;
    const project = req.params?.projectId;

    const files = await File.find({
        project,
        organisation: orgId
    })
    .select("fileName fileUrl uploadedBy fileType createdAt size")
    .populate("uploadedBy","name avatar")
    .lean();

    res
    .status(200)
    .json(
        new ApiResponse( 200, files, "Fetched Successfully")
    )
})

const deleteProjectFile = asyncHandler(async(req,res)=>{
    const { fileId } = req.params;
    const managerId = req.user?._id;

    const file = await File.findById(fileId).populate("project").select("resourceType project publicId");

    if(!file){
        throw new ApiError(404,"File doesn't exists!");
    }

    const isValidPersonToDelete = file.project?.members?.includes(managerId.toString()) || file.project?.createdBy?.toString() === managerId.toString();

    if(!isValidPersonToDelete){
        throw new ApiError(403,"You are not allowed to delete.")
    }

    await deleteFromCloudinary(file.publicId, file.resourceType || "image");

    const deletedFile = await File.findByIdAndDelete(fileId);

    if(!deletedFile){
        throw new ApiError(500,"Something went wrong while deleting file from database.")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, {}, "File deleted successfully!")
    )
})

export {
    managerProjects,
    getAllUsers,
    createNewProject,
    updateExistedProject,
    deleteManagerProject,
    getProject,
    updateTaskStatusById,
    createNewTask,
    uploadFileController,
    getProjectFilesController,
    deleteProjectFile,
}

