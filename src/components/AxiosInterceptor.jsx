"use client"

import { useEffect } from "react"
import { setupAxiosInterceptors } from "../api/api"
import { useAuth } from "../context/AuthContext"

export const AxiosInterceptor = ({ children }) => {
  const { _, loading, login, logout, handleUnauthorized } = useAuth()



  useEffect(() => {
    setupAxiosInterceptors(handleUnauthorized)
  }, [handleUnauthorized])

  return children
}

