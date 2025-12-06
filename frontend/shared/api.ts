import axios from "axios";

export const api = axios.create({
    baseURL: "https://refocus-n0hq.onrender.com/api",
});
