"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "@/api/api"
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
import Grid from "@mui/material/Grid"

const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [openSnack, setOpenSnack] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
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
    setError("")

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setIsLoading(true)
    try {
      const response = await api.register({ firstName, lastName, email, password })
      console.log("Registration successful:", response.data)
      navigate("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      const message = error?.response?.data ?? "Ошибка регистрации. Пожалуйста, попробуйте снова."
      setErrorMessage(message)
      handleOpenSnack()
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
            <img
              src="/logo.png"
              alt="Legentum Logo"
              style={{ width: 32, height: 32, marginRight: 8, borderRadius: "50%" }}
            />
            <Typography component="h1" variant="h4" fontWeight={700}>
              Legentum
            </Typography>
          </Box>
          <Typography component="h2" variant="h5" fontWeight={600}>
            Регистрация
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Имя"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Фамилия"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
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
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="confirm-password">Подтверждение пароля</InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  label="Подтверждение пароля"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              Уже есть аккаунт?{" "}
              <Link to="/login" style={{ color: "#3498db", textDecoration: "none" }}>
                Войти
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

export default Register
