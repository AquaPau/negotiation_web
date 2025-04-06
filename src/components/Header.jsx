"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Header = () => {
  const { user, loading, login, logout, handleUnauthorized } = useAuth()

  return (
    <header className="bg-background border-b bg-stone-200 dark:border-bg-stone-500">
      <nav className="app-container h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-center font-semibold text-foreground">
                 Legentum: подготовка к переговорам по юридическим документам
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/" className="nav-item">
                Управление компаниями
              </Link>
              <Link to="/" className="nav-item">
                Управление проектами
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

