"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setupAxiosInterceptors } from "../api/api"
import { useAuth } from "../context/AuthContext"

export const AxiosInterceptor = ({ children }) => {
  const { user, loading, login, logout, handleUnauthorized } = useAuth()



  useEffect(() => {
    setupAxiosInterceptors(handleUnauthorized)
  }, [handleUnauthorized])

  return children
}

