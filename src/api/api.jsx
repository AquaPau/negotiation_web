import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api" // Replace with your actual API base URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
})

export const api = {
  // Authentication
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (userData) => axiosInstance.post("/auth/register", userData),
  logout: () => axiosInstance.post("/auth/logout"),

  // Company
  userData: () => axiosInstance.get("/user/current-user"),
  getCompanyData: () => axiosInstance.get("/company/own"),
  createCompany: (companyData) => axiosInstance.post("/company/own", companyData),
  updateCompany: (companyData) => axiosInstance.put("/company/own", companyData),
  uploadCompanyFiles: (companyId, files, types) => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append("documents", file)
      formData.append("types", types[index])
    })
    return axiosInstance.put(`/company/own/${companyId}/document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getCompanyDocuments: (companyId) => axiosInstance.get(`/company/own/${companyId}/documents`),

  // Contractors
  getContractors: () => axiosInstance.get("/contractors"),
  getContractorDetails: (id) => axiosInstance.get(`/contractors/${id}`),
  addContractor: (contractorData) => axiosInstance.post("/contractors", contractorData),
  getDocumentContent: (id) => axiosInstance.get(`/documents/${id}/content`),
  getDocumentRisks: (id) => axiosInstance.get(`/documents/${id}/risks`),
  getInteractionPossibilities: (id) => axiosInstance.get(`/contractors/${id}/possibilities`),
}

