"use client"

import { useEffect } from "react"
import { setupAxiosInterceptors } from "../api/api"
import { useAuth } from "../context/AuthContext"
import { useLocation } from "react-router-dom"

export const AxiosInterceptor = ({ children }) => {
  const { _, loading, login, logout, handleUnauthorized } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const customUnauthorizedHandler = () => {
      if (location.pathname === "/faq") {
        return
      }
      handleUnauthorized()
    }

    setupAxiosInterceptors(customUnauthorizedHandler)
  }, [handleUnauthorized, location.pathname])

  return children
}


