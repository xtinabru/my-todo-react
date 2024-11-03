import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Authentication.css';
import { useUser } from '../context/useUser';

export const AuthenticationMode = Object.freeze({
  Login: 'Login',
  Register: 'Register'
});

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signUp, signIn } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Состояние для хранения ошибки

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем предыдущее сообщение об ошибке

    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp({ email: user.email, password: user.password }); // Передаем email и password
        navigate('/signin');
      } else {
        await signIn({ email: user.email, password: user.password }); // Передаем email и password
        navigate('/');
      }
    } catch (error) {
      // Обработка ошибки
      const message = error.response && error.response.data ? error.response.data.error : 'An error occurred';
      setError(message); // Устанавливаем сообщение об ошибке в состоянии
    }
  };

  return (
    <div className="authentication-container">
      <h3>{authenticationMode === AuthenticationMode.Login ? 'Sign in' : 'Sign up'}</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>} {/* Отображаем сообщение об ошибке */}
        <div>
          <label>Email</label>
          <input 
            type='email' 
            value={user.email|| ''} 
            onChange={e => setUser({ ...user, email: e.target.value })} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type='password' 
            value={user.password|| ''} 
            onChange={e => setUser({ ...user, password: e.target.value })} 
            required 
          />
        </div>
        <div>
          <button type="submit">{authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}</button>
        </div>
        <div>
          <Link to={authenticationMode === AuthenticationMode.Login ? '/signup' : '/signin'}>
            {authenticationMode === AuthenticationMode.Login ? 'No account? Sign up' : 'Already signed up? Sign in'}
          </Link>
        </div>
      </form>
    </div>
  );
}
