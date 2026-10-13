import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const getTeamMembers = async() =>{
    const response = await axios.get(`${apiUrl}/shared/team-members`,{
        withCredentials: true
    });

    return response?.data;
}

export {
    getTeamMembers,
}