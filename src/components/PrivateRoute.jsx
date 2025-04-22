"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isSessionValid, setIsSessionValid] = useState(false)

  useEffect(() => {
    // Проверяем валидность сессии
    const checkSession = async () => {
      try {
        // Если куки с сессией валидны, этот запрос должен пройти успешно
        await api.userData()
        setIsSessionValid(true)
      } catch (error) {
        // Если запрос не удался, значит сессия недействительна
        setIsSessionValid(false)
      } finally {
        setIsCheckingSession(false)
      }
    }

    // Если загрузка завершена, проверяем сессию
    if (!loading) {
      checkSession()
    }
  }, [loading])

  // Показываем индикатор загрузки, пока проверяется сессия
  if (loading || isCheckingSession) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  // Если сессия недействительна, перенаправляем на страницу входа
  if (!isSessionValid) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Если сессия действительна, показываем защищенный контент
  return children
}

export default PrivateRoute
