import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div>
          {user ? (
            <>
              <Link to="/" className="mr-4">Управление компаниями</Link>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Выход</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Вход</Link>
              <Link to="/register" className="bg-blue-500 px-4 py-2 rounded">Регистрация</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;