import axios from "axios"


const API_BASE_URL = import.meta.env.VITE_HOST_URL

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

  // Companies
  getUserCompanies: () => axiosInstance.get(`/company`),
  getCompany: (companyId) => axiosInstance.get(`/company/${companyId}`),
  createCompany: (companyData) => axiosInstance.post("/company", companyData),
  deleteCompany: (companyData) => axiosInstance.delete(`/company/${companyData.id}`),

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
  getCompanyDocument: (companyId, documentId) => axiosInstance.get(`/company/${companyId}/document/${documentId}`),
  deleteCompanyDocument: (companyId, documentId) => axiosInstance.delete(`/company/${companyId}/document/${documentId}`),
  deleteCompanyDocuments: (companyId) => axiosInstance.delete(`/company/${companyId}/document`),

  // Company contractors
  getContractors: (companyId) => axiosInstance.get(`/company/${companyId}/contractor`),
  getContractor: (companyId, contractorId) => axiosInstance.get(`/company/${companyId}/contractor/${contractorId}`),
  createContractor: (companyId, contractorData) => axiosInstance.post(`/company/${companyId}/contractor`, contractorData),
  deleteContractor: (companyId, contractorId) => axiosInstance.delete(`/company/${companyId}/contractor/${contractorId}`),

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
  getContractorDocument: (companyId, contractorId, documentId) => axiosInstance.get(`/company/${companyId}/contractor/${contractorId}/document/${documentId}`),
  deleteContractorDocument: (companyId, contractorId, documentId) => axiosInstance.delete(`/company/${companyId}/contractor/${contractorId}/document/${documentId}`),
  deleteContractorDocuments: (companyId, contractorId) => axiosInstance.delete(`/company/${companyId}/contractor/${contractorId}/document`),

  // Projects
  getUserProjects: () => axiosInstance.get(`/project`),
  createProject: (projectData) => axiosInstance.post(`/project`, projectData),
  getProject: (projectId) => axiosInstance.get(`/project/${projectId}`),
  deleteProject: (projectId) => axiosInstance.delete(`/project/${projectId}`),

  // Project documents
  uploadProjectDocuments: (projectId, files, types) => {
        const formData = new FormData()
        files.forEach((file, index) => {
          formData.append("documents", file)
          formData.append("types", types[index])
        })
        return axiosInstance.put(`/project/${projectId}/document`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      },
  getProjectDocuments: (projectId) => axiosInstance.get(`/project/${projectId}/document`),
  getProjectDocument: (projectId, documentId) => axiosInstance.get(`/project/${projectId}/document/${documentId}`),
  deleteProjectDocument: (projectId, documentId) => axiosInstance.delete(`/project/${projectId}/document/${documentId}`),
  deleteProjectDocuments: (projectId) => axiosInstance.delete(`/project/${projectId}/document`),

  //Task status
  getTaskStatus: (id) => axiosInstance.get(`/task/${id}`),

  // AI functions
  getDocumentDescription: (id, retry) => axiosInstance.get(`/analyse/document/${id}/description?retry=${retry}`),
  getDocumentRisks: (id, retry) => axiosInstance.get(`/analyse/document/${id}/risks?retry=${retry}`),
  getProjectResolution: (id, retry) => axiosInstance.get(`/analyse/project/${id}/resolution?retry=${retry}`),

}

