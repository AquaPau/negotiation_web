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

export const setupAxiosInterceptors = (handleUnauthorized) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        handleUnauthorized()
      }
      return Promise.reject(error)
    },
  )
}

export const api = {
  // Authentication
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (userData) => axiosInstance.post("/auth/register", userData),
  logout: async () => {
      try {
        await axiosInstance.post("/auth/logout")
      } catch (error) {
        console.error("Logout API error:", error)
        // Still proceed with local logout even if API call fails
        throw error
      }
    },

  // User
  userData: () => axiosInstance.get("/user/current-user"),
  getUserCompanies: () => axiosInstance.get(`/company`),

  // Companies
  getCompany: (companyId) => axiosInstance.get(`/company/${companyId}`, companyId),
  createCompany: (companyData) => axiosInstance.post("/company", companyData),
  updateCompany: (companyData) => axiosInstance.put(`/company/${companyData.id}`, companyData),

  // Company contractors
  getContractors: (companyId) => axiosInstance.get(`/company/${companyId}/contractor`),

  // Company documents
  uploadCompanyDocuments: (companyId, files, types) => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append("documents", file)
      formData.append("types", types[index])
    })
    return axiosInstance.put(`/company/${companyId}/document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getCompanyDocuments: (companyId) => axiosInstance.get(`/company/${companyId}/document`),

  // Contractors
  getContractor: (companyId, contractorId) => axiosInstance.get(`/company/${companyId}/contractor/${contractorId}`),
  createContractor: (companyId, contractorData) => axiosInstance.post(`/company/${companyId}/contractor`, contractorData),

  // Contractor documents
  uploadContractorDocuments: (companyId, contractorId, files, types) => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append("documents", file)
      formData.append("types", types[index])
    })
    return axiosInstance.put(`/company/${companyId}/contractor/${contractorId}/document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getContractorDocuments: (companyId, contractorId) => axiosInstance.get(`/company/${companyId}/contractor/${contractorId}/document`),

  // AI functions
  getDocumentInsights: (id) => axiosInstance.get(`/analyse/document/${id}/description`),
  getDocumentRisks: (id) => axiosInstance.get(`/analyse/document/${id}/risks`),
  getInteractionPossibilities: (companyId, contractorId) => axiosInstance.get(`/analyse/company/${companyId}/contractor/${contractorId}/opportunities`),
}

