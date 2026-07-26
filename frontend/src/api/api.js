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
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post("/jobs", data);
export const applyToJob = (jobId) => api.post(`/jobs/${jobId}/apply`);
export const updateJobStatus = (jobId, status) => api.patch(`/jobs/${jobId}/status`, { status });
export const getJobsPostedByEmployer = (employerId) => api.get(`/jobs/employer/${employerId}`);
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




// import axios from "axios";
// import {
//   mockJobs,
//   mockWorkers,
//   mockReviews,
//   mockApplications,
//   mockPostedJobs,
//   mockApplicantsByJob,
// } from "./mockData";

// const USE_MOCK = true; // flip to false once your backend is ready

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const mockResponse = (data) => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve({ data }), 400);
//   });
// };

// export const loginUser = (credentials) => {
//   if (USE_MOCK) {
//     return mockResponse({
//       token: "mock-token",
//       user: { id: 1, name: "Test User", role: "both" },
//     });
//   }
//   return api.post("/auth/login", credentials);
// };

// export const registerUser = (data) => {
//   if (USE_MOCK) return mockResponse({ message: "Registered successfully" });
//   return api.post("/auth/register", data);
// };

// export const getJobs = () => {
//   if (USE_MOCK) return mockResponse(mockJobs);
//   return api.get("/jobs");
// };

// export const getJobById = (id) => {
//   if (USE_MOCK) {
//     const job = mockJobs.find((j) => j.id === Number(id));
//     return mockResponse(job);
//   }
//   return api.get(`/jobs/${id}`);
// };

// export const createJob = (data) => {
//   if (USE_MOCK) return mockResponse({ id: 99, ...data });
//   return api.post("/jobs", data);
// };

// export const applyToJob = (jobId) => {
//   if (USE_MOCK) return mockResponse({ message: "Applied successfully" });
//   return api.post(`/jobs/${jobId}/apply`);
// };

// export const updateJobStatus = (jobId, status) => {
//   if (USE_MOCK) return mockResponse({ jobId, status });
//   return api.patch(`/jobs/${jobId}/status`, { status });
// };

// export const getJobsPostedByEmployer = (employerId) => {
//   if (USE_MOCK) return mockResponse(mockPostedJobs);
//   return api.get(`/jobs/employer/${employerId}`);
// };

// export const getApplicationsForJob = (jobId) => {
//   if (USE_MOCK) return mockResponse(mockApplicantsByJob[jobId] || []);
//   return api.get(`/jobs/${jobId}/applications`);
// };

// export const getMyApplications = () => {
//   if (USE_MOCK) return mockResponse(mockApplications);
//   return api.get("/applications/me");
// };

// export const updateApplicationStatus = (applicationId, status) => {
//   if (USE_MOCK) return mockResponse({ applicationId, status });
//   return api.patch(`/applications/${applicationId}`, { status });
// };

// export const getWorkers = () => {
//   if (USE_MOCK) return mockResponse(mockWorkers);
//   return api.get("/workers");
// };

// export const getWorkerById = (id) => {
//   if (USE_MOCK) {
//     const worker = mockWorkers.find((w) => w.id === Number(id));
//     return mockResponse(worker);
//   }
//   return api.get(`/workers/${id}`);
// };

// export const getUserProfile = (id) => {
//   if (USE_MOCK) {
//     const worker = mockWorkers.find((w) => w.id === Number(id));
//     return mockResponse(worker || mockWorkers[0]);
//   }
//   return api.get(`/users/${id}`);
// };

// export const updateUserProfile = (id, data) => {
//   if (USE_MOCK) return mockResponse({ id, ...data });
//   return api.put(`/users/${id}`, data);
// };

// export const submitReview = (data) => {
//   if (USE_MOCK) return mockResponse({ message: "Review submitted" });
//   return api.post("/reviews", data);
// };

// export const getReviewsForUser = (userId) => {
//   if (USE_MOCK) return mockResponse(mockReviews);
//   return api.get(`/reviews/user/${userId}`);
// };

// export default api;