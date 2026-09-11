import { File } from "../../models/file.models.js";
import { Project } from "../../models/project.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

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

export {
    getFilesController,
}