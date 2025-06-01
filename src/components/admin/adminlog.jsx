import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure React Router is used
import Header from '../header/header';
import Footer from '../footer/footer';
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
            <div className="login-header">
              <h2>Admin Portal</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2">
                Login
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
