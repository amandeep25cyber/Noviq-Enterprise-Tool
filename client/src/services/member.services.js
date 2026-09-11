import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getDashboardStats = async()=>{
    const res = await axios.get(`${API_URL}/member/dashboard-stats`,{
        withCredentials:true
    })

    return res?.data;
}

const getTodaysTasks = async()=>{
    const res = await axios.get(`${API_URL}/member/todays-tasks`,{
        withCredentials:true
    })

    return res?.data;
}

const updateLogtimeAndStatus = async(data)=>{
    const res = await axios.put(`${API_URL}/member/log-time`,data,{
        withCredentials:true
    })

    return res?.data;
}

const getUserTasks = async()=>{
    const res = await axios.get(`${API_URL}/member/tasks`,{
        withCredentials:true
    })

    return res?.data;
}

const getFilesOfUser = async()=>{

    const res = await axios.get(`${API_URL}/member/files`,{
        withCredentials: true,
    })

    return res?.data;
}

const getInvolvedProjects = async() =>{

    const res = await axios.get(`${API_URL}/member/projects`,{
        withCredentials: true,
    })

    return res?.data;
}

const uploadFileOfMember = async(data) =>{

    const res = await axios.post(`${API_URL}/member/file`,data,{
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return res?.data;
}

const deleteFileById = async(id) =>{

    const res = await axios.delete(`${API_URL}/member/file/${id}`,{
        withCredentials: true,
    })

    return res?.data;
}

export {
    getDashboardStats,
    getTodaysTasks,
    updateLogtimeAndStatus,
    getUserTasks,
    getFilesOfUser,
    getInvolvedProjects,
    uploadFileOfMember,
    deleteFileById,
}