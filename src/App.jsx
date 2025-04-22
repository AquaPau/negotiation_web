"use client"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "./theme/theme"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Contractor from "./pages/Contractor"
import Project from "@/pages/Project"
import Company from "@/pages/Company"
import CompanyDocument from "@/pages/CompanyDocument"
import ContractorDocument from "@/pages/ContractorDocument"
import FAQ from "@/pages/FAQ"
import { AxiosInterceptor } from "./components/AxiosInterceptor"
import "@/App.css"
import { Box, CircularProgress } from "@mui/material"

// Добавим проверку загрузки аутентификации
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AxiosInterceptor>
            <AppContent />
          </AxiosInterceptor>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

// Создадим отдельный компонент для содержимого приложения
function AppContent() {
  const { loading } = useAuth()

  // Показываем индикатор загрузки, пока проверяется аутентификация
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="py-4 px-4 md:px-6 max-w-7xl mx-auto flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/:companyId"
            element={
              <PrivateRoute>
                <Company />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/:companyId/contractor/:contractorId"
            element={
              <PrivateRoute>
                <Contractor />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/:companyId/document/:documentId"
            element={
              <PrivateRoute>
                <CompanyDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/:companyId/contractor/:contractorId/document/:documentId"
            element={
              <PrivateRoute>
                <ContractorDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <PrivateRoute>
                <Project />
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
      <Footer />
    </div>
  )
}

export default App

