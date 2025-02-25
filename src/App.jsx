"use client"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contractor from "./pages/Contractor";
import Company from "@/pages/Company"
import { AxiosInterceptor } from "./components/AxiosInterceptor"
import '@/App.css';

function App() {

  return (
      <Router>
    <AuthProvider>
        <AxiosInterceptor>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/company/:companyId" element={<Company />} />
              <Route path="/company/:companyId/contractor/:contractorId" element={<Contractor />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route
                      path="*"
                      element={
                        <div>
                          404 - Not found. URL: {location.pathname}
                          <br />
                          <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
                            Вернуться на главную
                          </a>
                        </div>
                      }
                    />
            </Routes>
          </main>
        </div>
        </AxiosInterceptor>
    </AuthProvider>
    </Router>
  );
}

export default App;