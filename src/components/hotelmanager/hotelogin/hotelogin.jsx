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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setSuccess(false);

  if (!formData.username || !formData.password) {
    setError('Username and password are required');
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/staff/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid credentials or insufficient privileges.');
    }

    const staff = await response.json();
    if (staff.role !== 'Hotel Manager') {
      throw new Error('Only Hotel Managers can log in.');
    }

    localStorage.setItem('staffId', staff.staffId);
    localStorage.setItem('username', staff.username); // Store username
    setSuccess(true);
    setFormData({
      username: '',
      password: '',
    });
    console.log('Successfully Logged In!', staff);
    navigate('/hotelhome');
    setTimeout(() => setSuccess(false), 3000);
  } catch (err) {
    console.error('Login error:', err);
    setError(err.message || 'Failed to connect to server. Please try again later.');
    setSuccess(false);
  } finally {
    setIsLoading(false);
  }
};

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Please enter your registered email address');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setForgotPasswordError('');
    setForgotPasswordMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/staff/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      setForgotPasswordMessage(`Password reset instructions have been sent to ${forgotPasswordEmail}`);
      setForgotPasswordEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordMessage('');
      }, 5000);
    } catch (err) {
      console.error('Forgot password error:', err);
      setForgotPasswordError(err.message || 'Failed to process your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Header />
      <div className="login-container">
        <div className="login-overlay"></div>
        <div className="login-box">
          {!showForgotPassword ? (
            <>
              <div className="login-header">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="AI Human"
                  className="ai-human-icon"
                />
                <h1>Hotel Manager Login</h1>
                <p>Sign in with your manager credentials</p>
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
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <i
                      className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
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
                <div className="forgot-password-link">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="login-header">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
                  alt="Password Reset"
                  className="ai-human-icon"
                />
                <h1>Reset Password</h1>
                <p>Enter your email to receive reset instructions</p>
              </div>
              <form onSubmit={handleForgotPassword} className="login-form">
                {forgotPasswordMessage && (
                  <div className="alert alert-success">{forgotPasswordMessage}</div>
                )}
                {forgotPasswordError && (
                  <div className="alert alert-danger">{forgotPasswordError}</div>
                )}
                <div className="form-group">
                  <div className="input-with-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                      alt="Email"
                      className="human-icon"
                    />
                    <input
                      type="email"
                      name="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="login-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner"></span> Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordError('');
                      setForgotPasswordMessage('');
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;