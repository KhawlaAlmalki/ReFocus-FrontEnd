import axios from "axios";

// ⚠️ DEPRECATED: This file is kept for backward compatibility only.
// New code should use frontend/src/lib/api-client.ts instead.
export const api = axios.create({
    baseURL: "https://refocus-n0hq.onrender.com/api",
    withCredentials: true, // Enable cookies/auth
});
