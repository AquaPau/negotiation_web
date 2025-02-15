import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Replace with your actual API base URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

// withCredentials: true;

export const api = {
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (userData) => axiosInstance.post("/auth/register", userData),
  logout: () => axiosInstance.post("/auth/logout"),
  getCompanyData: () => axiosInstance.get("/company"),
  createCompany: (companyData) => axiosInstance.post("/company", companyData),
  updateCompany: (companyData) => axiosInstance.put("/company", companyData),
  getContractors: () => axiosInstance.get("/contractors"),
  getContractorDetails: (id) => axiosInstance.get(`/contractors/${id}`),
  addContractor: (contractorData) => axiosInstance.post("/contractors", contractorData),
  getDocumentContent: (id) => axiosInstance.get(`/documents/${id}/content`),
  getDocumentRisks: (id) => axiosInstance.get(`/documents/${id}/risks`),
  getInteractionPossibilities: (id) => axiosInstance.get(`/contractors/${id}/possibilities`),
}