import axios from "axios";

const isProduction = import.meta.env.PROD;
export const baseURLL = isProduction
  ? (import.meta.env.VITE_API_URL || "https://your-api-url.onrender.com")
  : "http://localhost:9090";

export const axiosInstance = axios.create({
  baseURL: baseURLL,
});

export const generateResume = async (description) => {
  const response = await axiosInstance.post("/api/v1/resume/generate", {
    userDescription: description,
  });

  return response.data;
};

export const saveResume = async (resume) => {
  const response = await axiosInstance.post("/api/v1/resume/save", resume);
  return response.data;
};

export const getResumesByUserEmail = async (userEmail) => {
  const response = await axiosInstance.get(`/api/v1/resume/user/${encodeURIComponent(userEmail)}`);
  return response.data;
};

export const getResumeById = async (id) => {
  const response = await axiosInstance.get(`/api/v1/resume/${id}`);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await axiosInstance.delete(`/api/v1/resume/${id}`);
  return response.data;
};

export const getInterviewQuestions = async () => {
  const response = await axiosInstance.get("/api/v1/interview/questions");
  return response.data;
};

export const generateInterviewQuestionsBySkills = async (skills) => {
  const response = await axiosInstance.post("/api/v1/interview/questions/skills", {
    skills,
  });
  return response.data;
};
