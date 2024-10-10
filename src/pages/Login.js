import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/Login.css';

const url_api = "http://localhost:4000";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();
  const notyf = new Notyf();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url_api}/users/login`, {
        email,
        password,
      });
      if (response.data.access) {
        login(response.data.access);
        setEmail('');
        setPassword('');
        notyf.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging in', error);
      notyf.error('Invalid login credentials, please try again.');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleLogin} className="login-form p-4 shadow rounded">
        <h2 className="text-center mb-4">Login</h2>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block mt-3">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
