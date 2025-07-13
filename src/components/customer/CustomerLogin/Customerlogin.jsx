import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Button, Alert, Card, FloatingLabel, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './CustomerLogin.css';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: location.state?.registeredUsername || '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
              <FloatingLabel controlId="username" label="Username" className="mb-3">
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
                    placeholder="Username"
                  />
                </InputGroup>
                {errors.username && (
                  <Form.Text className="text-danger">{errors.username}</Form.Text>
                )}
              </FloatingLabel>

              <FloatingLabel controlId="password" label="Password" className="mb-3">
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
                    placeholder="Password"
                  />
                </InputGroup>
                {errors.password && (
                  <Form.Text className="text-danger">{errors.password}</Form.Text>
                )}
              </FloatingLabel>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check type="checkbox" label="Remember me" />
                <Button
                  variant="link"
                  onClick={() => navigate('/forgot-password')}
                  className="p-0 text-decoration-none"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center">
                <span>Don't have an account? </span>
                <Link to="/custreg" className="text-decoration-none">
                  <Button variant="link" className="p-0">
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