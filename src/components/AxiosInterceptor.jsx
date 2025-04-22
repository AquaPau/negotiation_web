"use client"

import { useEffect } from "react"
import { setupAxiosInterceptors } from "../api/api"
import { useAuth } from "../context/AuthContext"
import { useLocation } from "react-router-dom"

export const AxiosInterceptor = ({ children }) => {
  const { user, loading, login, logout, handleUnauthorized } = useAuth()
  const location = useLocation()

  useEffect(() => {
    // Создаем обработчик, который проверяет текущий путь
    const customUnauthorizedHandler = () => {
      // Если пользователь на странице FAQ или других публичных страницах, не выполняем перенаправление
      if (location.pathname === "/faq" || location.pathname === "/login" || location.pathname === "/register") {
        return
      }

      // Проверяем, есть ли пользователь в localStorage
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        // Если пользователя нет, выполняем стандартную обработку неавторизованного доступа
        handleUnauthorized()
      }
    }

    setupAxiosInterceptors(customUnauthorizedHandler)
  }, [handleUnauthorized, location.pathname])

  return children
}


