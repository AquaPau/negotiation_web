"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/api/api"

const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

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
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="form-container">
        <div className="text-center mb-8">
          <h2 className="section-title">Создание аккаунта</h2>
          <p className="text-muted-foreground mt-2">Присоединяйтесь к нашей сети профессионалов</p>
          {error && <p className="text-destructive mt-2">{error}</p>}
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label htmlFor="first-name" className="input-label">
                Имя
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                required
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="last-name" className="input-label">
                Фамилия
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="email-address" className="input-label">
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password" className="input-label">
              Подтверждение пароля
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="button-primary w-full">
            Создать аккаунт
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

