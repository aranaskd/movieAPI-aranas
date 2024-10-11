import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/Register.css';

const url_api = "https://movieapp-api-lms1.onrender.com";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const notyf = new Notyf();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url_api}/users/register`, {
        email,
        password,
      });
      if (response) {
        notyf.success('Registration successful!');
        setEmail('');
        setPassword('');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error registering', error);
      notyf.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleRegister} className="register-form p-4 shadow rounded">
        <h2 className="text-center mb-4">Register</h2>
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
