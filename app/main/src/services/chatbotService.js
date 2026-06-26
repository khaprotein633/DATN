import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getAnswerFromAI = async ({message,history = []}) => {
    try {
        const response = await api.post("/chatbot",{message,history,});
        return response.data;

    } catch (error) {
        console.error("Chat AI error:",error.response?.data || error.message);
        throw error;
    }
};