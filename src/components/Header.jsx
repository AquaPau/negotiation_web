"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { blueGrey, red } from '@mui/material/colors';

const Header = () => {
  const { user, loading, login, logout, handleUnauthorized } = useAuth()

  return (
      <div  style={{ background: "#cfd8dc", width: "100%" }}>
          <AppBar className="border-b dark:border-bg-stone-500" position="static"  style={{ background: "#cfd8dc", width: "100%" }} color="inherit">
              <Toolbar className="app-container h-16 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                      <Typography variant="h6">
                          <Link to="/" className="text-center font-semibold text-foreground">
                              Legentum: подготовка к переговорам по юридическим документам
                          </Link>
                      </Typography>

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
              </Toolbar>
          </AppBar>
      </div>
  )
}

export default Header

