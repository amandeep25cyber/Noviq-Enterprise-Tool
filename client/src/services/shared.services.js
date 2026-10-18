import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const getTeamMembers = async() =>{
    const response = await axios.get(`${apiUrl}/shared/team-members`,{
        withCredentials: true
    });

    return response?.data;
}

const getProjectsGroup = async()=>{
    const response = await axios.get(`${apiUrl}/shared/projects`,{
        withCredentials: true
    });

    return response?.data;
}

const sendDirectMessage = async(message, sendTo) =>{
    const response = await axios.post(`${apiUrl}/shared/direct-message`,
        { message, sendTo },
        { withCredentials: true }
    );
    return response?.data;
}

const getDirectMessages = async(recId) =>{
    const response = await axios.get(`${apiUrl}/shared/direct-message/${recId}`,{
        withCredentials: true
    });
    return response?.data;
}

const sendProjectMessage = async(message, projectId) =>{
    const response = await axios.post(`${apiUrl}/shared/project-message`,
        { message, projectId },
        { withCredentials: true }
    );
    return response?.data;
}

const getProjectMessages = async(projectId) =>{
    const response = await axios.get(`${apiUrl}/shared/project-message/${projectId}`,{
        withCredentials: true
    });
    return response?.data;
}

export {
    getTeamMembers,
    getProjectsGroup,
    sendDirectMessage,
    getDirectMessages,
    sendProjectMessage,
    getProjectMessages,
}