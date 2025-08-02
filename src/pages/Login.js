import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include' // Send cookies
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Login to HealthCare</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} autoComplete="off">
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <button className="btn-primary" type="submit">Login</button>
        </form>
        <p>New user? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}

export default Login;
