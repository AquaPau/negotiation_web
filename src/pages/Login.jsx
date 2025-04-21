"use client"

import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { api } from "../api/api"
import TextField from "@mui/material/TextField"
import InputLabel from "@mui/material/InputLabel"
import InputAdornment from "@mui/material/InputAdornment"
import FormControl from "@mui/material/FormControl"
import OutlinedInput from "@mui/material/OutlinedInput"
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Container from "@mui/material/Container"
import GavelIcon from "@mui/icons-material/Gavel"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenSnack = () => {
    setOpenSnack(true)
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnack(false)
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.login({ email, password })
      login(response.data)

      // Перенаправляем пользователя на страницу, с которой он пришел, или на главную
      const from = location.state?.from?.pathname || "/"
      navigate(from)
    } catch (error) {
      const message = error?.response?.data ?? "Неверный email или пароль"
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <GavelIcon sx={{ fontSize: 32, mr: 1, color: "primary.main" }} />
            <Typography component="h1" variant="h4" fontWeight={700}>
              Legentum
            </Typography>
          </Box>
          <Typography component="h2" variant="h5" fontWeight={600}>
            Вход в систему
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="password">Пароль</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Пароль"
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? "Вход..." : "Войти"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              Нет аккаунта?{" "}
              <Link to="/register" style={{ color: "#3498db", textDecoration: "none" }}>
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert severity="error" onClose={handleCloseSnack}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Login
