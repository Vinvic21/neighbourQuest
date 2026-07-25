import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
})
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})
export const loginUser = (credentials) => api.post("/auth/login", credentials)
export const registerUser = (data) => api.post("/auth/register", data)

export const getJobs = () => api.get("/jobs");
export const getJobById = () => api.get(`?jobs/${id}`)
export const createJob = (data) => api.post("/jobs", data);
export const applyToJob = (jobId) => api.post(`/jobs/${jobId}/apply`);
export const updateJobStatus = (jobId, status) => api.patch(`/jobs/${jobId}/status`, { status });
export const getApplicationsForJob = (jobId) => api.get(`/jobs/${jobId}/applications`)
export const getMyApplications = () => api.get("/applications/me")
export const updateApplicationStatus = (applicationId, status) => api.patch(`/applications/${applicationId}`, { status });
//workkers
export const getWorkers = () => api.get("/workers");
export const getWorkerById = (id) => api.get(`/workers/${id}`)
//pRofile
export const getUserProfile = (id) => api.get(`/users/${id}`);
export const updateUserProfile = (id, data) => api.put(`/users/${id}`, data);
//reviews
export const submitReview = (data) => api.post("/reviews", data);
export const getReviewsForUser = (userId) => api.get(`/reviews/user/${userId}`);

export default api;