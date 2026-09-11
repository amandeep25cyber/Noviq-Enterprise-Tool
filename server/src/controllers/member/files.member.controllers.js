import { File } from "../../models/file.models.js";
import { Project } from "../../models/project.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js"

const getFilesController = asyncHandler(async(req,res)=>{
    
    const orgId = req.user?.organisation;
    const userId = req.user?._id;

    const projects = await Project.find({
        members: userId,
        organisation: orgId,
    })
    .lean();

    const projectIds = projects.map(p=>p._id);

    const files = await File.find({
        project: { $in: projectIds},
        organisation: orgId
    })
    .select("fileName fileUrl uploadedBy project fileType createdAt size")
    .populate("uploadedBy","name avatar")
    .populate("project","title")
    .lean();

    res
    .status(200)
    .json(
        new ApiResponse( 200, files, "Fetched Successfully")
    )
})

const getUserInvolvedProjects = asyncHandler(async(req,res)=>{
    const userId = req?.user?._id;
    const orgId = req?.user?.organisation;

    const projects = await Project.find({
        organisation: orgId,
        members: userId,
    })
    .select("title")
    .lean();

    res
    .status(200)
    .json(
        new ApiResponse(200, projects, "Fetched Successfully.")
    )
})

const uploadFileforMemberController = asyncHandler(async(req,res)=>{
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

    const existedProject = await Project.findById(project);

    if(!existedProject){
        fs.unlinkSync(filePathName);
        throw new ApiError(403,"Project doesn't exists.")
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

export {
    getFilesController,
    getUserInvolvedProjects,
    uploadFileforMemberController,
}