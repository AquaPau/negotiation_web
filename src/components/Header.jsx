"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-background border-b border-neutral-200 dark:border-neutral-800">
      <nav className="app-container h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-lg font-semibold text-foreground">
            Legal Management System
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/" className="nav-item">
                Управление компаниями
              </Link>
              <button onClick={logout} className="button-secondary">
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                Вход
              </Link>
              <Link to="/register" className="button-primary">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header

