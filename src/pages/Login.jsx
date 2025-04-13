"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { api } from "../api/api"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false);

  const [openSnack, setOpenSnack] = useState(false)
  const handleOpenSnack = () => {
    setOpenSnack(true);
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const [errorMessage, setErrorMessage] = useState(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.login({ email, password })
      login(response.data)
      navigate("/")
    } catch (error) {
      const message = error?.response?.data ?? 'Неизвестная ошибка, повторите запрос'
      setErrorMessage(message)
      handleOpenSnack()
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="form-container">
        <Typography  className="section-title text-center mb-8" variant="h4" gutterBottom>
          Вход в систему
        </Typography>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="input-group">
            <TextField
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field w-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                variant="standard"
            />
          </div>
          <div className="input-group">
            <FormControl
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Пароль"
                variant="standard"
            >
              <InputLabel htmlFor="standard-adornment-password">Пароль</InputLabel>
              <Input
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
              />
            </FormControl>
          </div>
          <Button
              variant="outlined"
              type="submit"
              className="button-primary w-full"
          >
            Войти
          </Button>
        </form>
      </div>
      <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </div>
  )
}

export default Login

