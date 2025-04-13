"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/api"
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

const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    try {
      const response = await api.register({ firstName, lastName, email, password })
      console.log("Registration successful:", response.data)
      navigate("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      setError(error.response?.data?.message || "Ошибка регистрации. Пожалуйста, попробуйте снова.")
      const message = error?.response?.data ?? 'Ошибка регистрации. Пожалуйста, попробуйте снова.'
      setErrorMessage(message)
      handleOpenSnack()
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="form-container">
        <div className="text-center mb-8">
          <Typography variant="h4" gutterBottom>
            Создание аккаунта
          </Typography>
          <Typography variant="subtitle1" gutterBottom className="mt-2">
            Присоединяйтесь к нашей сети профессионалов
          </Typography>
          {error && <Typography variant="caption" gutterBottom className="text-destructive mt-2">
            {error}
          </Typography>}
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <TextField
                  id="first-name"
                  name="firstName"
                  type="text"
                  required
                  className="input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  label="Имя"
                  variant="standard"
              />
            </div>
            <div className="input-group">
              <TextField
                  id="last-name"
                  name="lastName"
                  type="text"
                  required
                  className="input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  label="Фамилия"
                  variant="standard"
              />
            </div>
          </div>
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
                autoComplete="new-password"
                required
                className="input-field w-100"
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
          <div className="input-group">
            <FormControl
                variant="standard"
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="input-field w-100"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            >
              <InputLabel htmlFor="standard-adornment-password">Подтверждение пароля</InputLabel>
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
          <Button variant="outlined" type="submit" className="button-primary w-full">
            Создать аккаунт
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

export default Register

