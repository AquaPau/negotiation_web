"use client"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "./theme/theme"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Contractor from "./pages/Contractor"
import Project from "@/pages/Project"
import Company from "@/pages/Company"
import CompanyDocument from "@/pages/CompanyDocument"
import ContractorDocument from "@/pages/ContractorDocument"
import { AxiosInterceptor } from "./components/AxiosInterceptor"
import "@/App.css"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AxiosInterceptor>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="py-4 px-4 md:px-6 max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/company/:companyId" element={<Company />} />
                  <Route path="/company/:companyId/contractor/:contractorId" element={<Contractor />} />
                  <Route path="/company/:companyId/document/:documentId" element={<CompanyDocument />} />
                  <Route
                    path="/company/:companyId/contractor/:contractorId/document/:documentId"
                    element={<ContractorDocument />}
                  />
                  <Route path="/project/:projectId" element={<Project />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <div className="flex flex-col items-center justify-center h-[60vh]">
                        <h1 className="text-2xl font-semibold mb-4">404 - Страница не найдена</h1>
                        <p className="mb-6">URL: {location.pathname}</p>
                        <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                          Вернуться на главную
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>
          </AxiosInterceptor>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
