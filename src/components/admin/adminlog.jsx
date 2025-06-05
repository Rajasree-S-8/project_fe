import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './adminlog.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (username === 'admin' && password === 'admin123') {
      navigate('/adminlog');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="no-scroll">
      <Header />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <div className="admin-logo">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="login-header">
              <h2>Admin Portal</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3 input-group">
                <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </button>
            </form>

            <div className="login-footer mt-3 text-center">
              <p className="text-muted small">Contact support if you need access</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
