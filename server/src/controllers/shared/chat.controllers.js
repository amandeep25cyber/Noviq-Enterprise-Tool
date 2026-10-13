import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.models.js";
import { Message } from "../../models/message.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";

const directMessageController = asyncHandler(async(req,res)=>{

    const { message, sendTo } = req.body;

    if(!message){
        throw new ApiError(400,"Empty Message is not allowed");
    }

    if(!sendTo){
        throw new ApiError(400,"Empty Id is not allowed");
    }

    const receiverUser = await User.findById(sendTo);

    if(!receiverUser){
        throw new ApiError(400,"Invalid reciever Credetials.");
    }

    if(String(req?.user?.orgId)!==String(receiverUser?.organisation)){
        throw new ApiError(400,"Can't send message to other organisation member.");
    }

    const createdMessage = await Message.create({
        organisation: req?.user?.orgId,
        message,
        sender: req.user?.userId,
        receiver: sendTo
    })

    if(!createdMessage){
        throw new ApiError(500, "Something went wrong while sending message.");
    }

    res
    .status(201)
    .json(
        new ApiResponse(201,createdMessage,"Message Send.")
    )
})

const getDirectMessageController = asyncHandler(async(req,res)=>{
    const receiverId = req.params?.recId; 
    
    if(!receiverId){
        throw new ApiError(400,"Invalid Id.");
    }

    const messages = await Message.find({
        organisation: req?.user?.orgId, 
        $or: [
            { sender: req?.user?.userId, receiver: receiverId },
            { sender: receiverId, receiver: req?.user?.userId }
        ]
        }).sort({ createdAt: 1 }); //naya vala niche hoga message

    res
    .status(200)
    .json(
        new ApiResponse(200,messages,"Messages fetched Successfully.")
    )
})

const getSidebarMembers = asyncHandler(async(req,res)=>{
    
    const currentUserId = new mongoose.Types.ObjectId(req.user?.userId);
    const orgId = new mongoose.Types.ObjectId(req.user?.orgId);

    const members = await User.aggregate([
        
        { 
            $match: { 
                organisation: orgId, 
                _id: { $ne: currentUserId } 
            } 
        },
        {
            $lookup: {
                from: "messages",
                let: { otherUserId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $and: [{ $eq: ["$sender", currentUserId] }, { $eq: ["$receiver", "$$otherUserId"] }] },
                                    { $and: [{ $eq: ["$sender", "$$otherUserId"] }, { $eq: ["$receiver", currentUserId] }] }
                                ]
                            }
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 }
                ],
                as: "latestMessage"
            }
        },
        {
            $addFields: {
                lastMessageTime: {
                    $cond: {
                        if: { $gt: [{ $size: "$latestMessage" }, 0] },
                        then: { $arrayElemAt: ["$latestMessage.createdAt", 0] },
                        else: new Date(0)
                    }
                },
                recentMessageText: {
                    $cond: {
                        if: { $gt: [{ $size: "$latestMessage" }, 0] },
                        then: { $arrayElemAt: ["$latestMessage.text", 0] },
                        else: ""
                    }
                }
            }
        },
        { 
            $sort: { lastMessageTime: -1 } 
        },
        { 
            $project: {
                name: 1,
                avatar: 1,
                status: 1
            } 
        }
    ]);

    res
    .status(200)
    .json(
        new ApiResponse(200, members, "Team members fetched successfully")
    )
})

export {
    directMessageController,
    getDirectMessageController,
    getSidebarMembers,
}