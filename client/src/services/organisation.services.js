import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;

const getUsers = async()=>{

    const res = await axios.get(`${apiUrl}/organisation/users`,{
        withCredentials:true
    });

    return res?.data;
}

const getTeamPerformance = async()=>{
    const res = await axios.get(`${apiUrl}/organisation/dashboard/team-performance`,{
        withCredentials:true
    })

    return res?.data;
}

const getdashboardStats = async()=>{
    const res = await axios.get(`${apiUrl}/organisation/dashboard/stats`,{
        withCredentials:true
    })

    return res?.data;
}

const getProjectsStats = async()=>{
    const res = await axios.get(`${apiUrl}/organisation/projects/stats`,{
        withCredentials:true
    })

    return res?.data;
}

const createUser = async(data)=>{
    const res = await axios.post(`${apiUrl}/organisation/user`,data,{
        withCredentials:true
    })

    return res?.data;
}

const getProjects = async() =>{
    const res = await axios.get(`${apiUrl}/organisation/projects`,{
        withCredentials:true
    })

    return res?.data;
}

const createProject = async(data) =>{
    const res = await axios.post(`${apiUrl}/organisation/project`,data,{
        withCredentials:true
    })

    return res?.data;
}

const updateProject = async(data,id) =>{
    const res = await axios.put(`${apiUrl}/organisation/project/${id}`,data,{
        withCredentials:true
    })

    return res?.data;
}

const deleteProject = async(projectId) =>{
    const res = await axios.delete(`${apiUrl}/organisation/project/${projectId}`,{
        withCredentials:true
    })

    return res?.data;
}

const getSingleProject = async(id) =>{
    const res = await axios.get(`${apiUrl}/organisation/project/${id}`,{
        withCredentials:true
    })

    return res?.data;
}

const taskStatusUpdate = async(status,id)=>{
    const res = await axios.put(`${apiUrl}/organisation/task/${id}/status`,{status},{
        withCredentials:true
    })

    return res?.data;
}

const createNewTask = async(data) =>{
    const res = await axios.post(`${apiUrl}/organisation/task`,data,{
        withCredentials:true
    })

    return res?.data;
}

const getFilesOfProject = async( id ) =>{
    const res = await axios.get(`${apiUrl}/organisation/file/${id}`,{
        withCredentials: true,
    })

    return res?.data;
}

export {
    getUsers,
    getTeamPerformance,
    getdashboardStats,
    getProjectsStats,
    createUser,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getSingleProject,
    taskStatusUpdate,
    createNewTask,
    getFilesOfProject,
}