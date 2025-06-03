import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../header/header.jsx';
import Footer from '../../footer/footer.jsx';
import './hotelogin.css';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (!formData.username || !formData.password) {
        setError('Username and password are required.');
        setSuccess(false);
        setIsLoading(false);
        return;
      }
      
      if (formData.username === 'hmngr' && formData.password === 'hmngr123') {
        setError('');
        setSuccess(true);
        navigate('/hotelhome');
        console.log('Successfully Logged In!', formData);
        setFormData({
          username: '',
          password: '',
        });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Invalid username or password.'); 
        setSuccess(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page-wrapper">
      <Header />
      
      <div className="login-container">
        <div className="login-overlay"></div>
        
        <div className="login-box">
          <div className="login-header">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
              alt="AI Human" 
              className="ai-human-icon" 
            />
            <h1>Welcome</h1>
            <p>Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {success && <div className="alert alert-success">Authentication successful</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="form-group">
              <div className="input-with-icon">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png" 
                  alt="User" 
                  className="human-icon"
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png" 
                  alt="Password" 
                  className="password-icon"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <i 
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>
            
            <div className="form-options">
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Authenticating...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Login;