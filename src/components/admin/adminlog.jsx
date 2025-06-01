import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer';
import './adminlog.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.username.trim()) newErrors.username = 'Username required';
    if (!credentials.password) newErrors.password = 'Password required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Hardcoded credentials (replace with real auth in production)
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const session = {
          token: 'auth-token-' + Math.random().toString(36).substring(2),
          expiresAt: Date.now() + 3600000, // 1 hour
          user: { name: 'Admin', role: 'admin' }
        };
        localStorage.setItem('adminSession', JSON.stringify(session));
        navigate('/admin');
      } else {
        setErrors({ form: 'Invalid credentials' });
      }
    } catch (error) {
      setErrors({ form: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
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

            {errors.form && <div className="alert alert-danger">{errors.form}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Signing in...
                  </>
                ) : 'Login'}
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