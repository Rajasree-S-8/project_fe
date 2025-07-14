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
            <h2 className="text-center mb-4">Customer Login</h2>

            {showSuccess && (
              <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                Registration successful! Please log in with your credentials.
              </Alert>
            )}

            {errors.api && (
              <Alert variant="danger" onClose={() => setErrors({...errors, api: ''})} dismissible>
                {errors.api}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faUser} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    className="form-control-custom"
                  />
                </InputGroup>
                {errors.username && (
                  <Form.Text className="text-danger">{errors.username}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faLock} />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    className="form-control-custom"
                  />
                </InputGroup>
                {errors.password && (
                  <Form.Text className="text-danger">{errors.password}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Remember me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <Button
                  variant="link"
                  onClick={() => navigate('/forgot-password')}
                  className="p-0 text-decoration-none"
                >
                  Forgot password?
                </Button>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 mb-3 login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center">
                <span>Don't have an account? </span>
                <Link to="/custreg" className="text-decoration-none">
                  <Button variant="link" className="p-0 register-link">
                    Register Here
                  </Button>
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