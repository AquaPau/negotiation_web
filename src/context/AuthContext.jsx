"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Проверяем, есть ли сохраненные данные пользователя
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          // Устанавливаем пользователя из localStorage
          setUser(JSON.parse(storedUser))

          // Проверяем валидность сессии на сервере
          try {
            // Если куки с сессией валидны, этот запрос должен пройти успешно
            const response = await api.userData()
            // Обновляем данные пользователя из ответа сервера
            setUser(response.data)
            localStorage.setItem("user", JSON.stringify(response.data))
          } catch (error) {
            // Если сервер вернул ошибку аутентификации, очищаем данные
            if (error?.response?.status === 401 || error?.response?.status === 403) {
              console.log("Сессия истекла, требуется повторный вход")
              setUser(null)
              localStorage.removeItem("user")
            }
          }
        } else {
          // Пробуем получить данные пользователя с сервера (возможно, куки сессии все еще валидны)
          try {
            const response = await api.userData()
            setUser(response.data)
            localStorage.setItem("user", JSON.stringify(response.data))
          } catch (error) {
            // Если запрос не удался, значит пользователь не аутентифицирован
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      navigate("/login")
    }
  }

  // Обновим handleUnauthorized, чтобы он проверял текущий путь
  const handleUnauthorized = () => {
    // Проверяем, находится ли пользователь на странице FAQ
    const currentPath = window.location.pathname
    if (currentPath === "/faq") {
      // Если на странице FAQ, не выполняем перенаправление
      return
    }

    // Иначе выполняем стандартную обработку
    setUser(null)
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, handleUnauthorized }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


