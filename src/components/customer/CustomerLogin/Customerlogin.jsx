import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Button, Alert, Card, FloatingLabel, InputGroup, FormCheck } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './CustomerLogin.css';
import Header from '../../header/header.jsx';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: location.state?.registeredUsername || '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check for remembered credentials
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setFormData(prev => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: true
      }));
    }

    if (location.state?.registrationSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:8080/api/customers/login', {
        username: formData.username,
        password: formData.password
      });

      // Handle remember me functionality
      if (formData.rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      localStorage.setItem('customer', JSON.stringify(response.data));
      navigate('/custhome', {
        state: {
          fromLogin: true,
          customerName: response.data.fullName
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      }
      setErrors({ api: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-background"></div>
      <div className="login-content">
        <Card className="login-card">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to your account</p>
            </div>

            {showSuccess && (
              <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible className="mb-4">
                Registration successful! Please log in with your credentials.
              </Alert>
            )}

            {errors.api && (
              <Alert variant="danger" onClose={() => setErrors({...errors, api: ''})} dismissible className="mb-4">
                {errors.api}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="auth-form">
              <FloatingLabel controlId="username" className="mb-3">
                <InputGroup>
                  <InputGroup.Text className="input-group-icon">
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    className="form-control-custom"
                  />
                </InputGroup>
                {errors.username && (
                  <Form.Text className="text-danger small">{errors.username}</Form.Text>
                )}
              </FloatingLabel>

              <FloatingLabel controlId="password" className="mb-3">
                <InputGroup>
                  <InputGroup.Text className="input-group-icon">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    className="form-control-custom"
                  />
                </InputGroup>
                {errors.password && (
                  <Form.Text className="text-danger small">{errors.password}</Form.Text>
                )}
              </FloatingLabel>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <FormCheck
                  type="checkbox"
                  id="rememberMe"
                  label="Remember me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="remember-me"
                />
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100 auth-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : 'Login'}
              </Button>

              <div className="text-center mt-4">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/custreg" className="register-link">
                  Register Here
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CustomerLogin;