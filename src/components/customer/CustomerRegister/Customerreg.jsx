import React, { useState } from 'react';
import { Form, Button, Alert, Card, FloatingLabel, InputGroup } from 'react-bootstrap';
import { faUser, faEnvelope, faLock, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Customerreg = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:9090/api/customers/register', {
        cust_username: formData.username,
        cust_fullName: formData.fullName,
        cust_email: formData.email,
        cust_password: formData.password,
        cust_phone: formData.phone,
        cust_address: formData.address
      });
      setErrors({});
      setSubmitted(true);
      setTimeout(() => {
        navigate('/custlog', { state: { customerName: formData.fullName } });
      }, 2000); // Navigate after showing success message
    } catch (error) {
      setErrors({ api: error.response?.data || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 1
      }}></div>
      <Card className="p-4 border-0 shadow" style={{ maxWidth: '500px', width: '100%', zIndex: 2 }}>
        <Card.Body>
          <h2 className="text-center mb-4">Create Account</h2>

          {submitted && <Alert variant="success" dismissible onClose={() => setSubmitted(false)}>
            Registration successful! Redirecting to login...
          </Alert>}
          {errors.api && <Alert variant="danger" dismissible onClose={() => setErrors({})}>
            {errors.api}
          </Alert>}

          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="username" className="mb-3">
              <InputGroup>
                <InputGroup.Text style={{ width: '40px' }}>
                  <FontAwesomeIcon icon={faUser} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  placeholder="Username"
                  style={{ paddingLeft: '10px' }}
                />
              </InputGroup>
              {errors.username && <Form.Text className="text-danger">{errors.username}</Form.Text>}
            </FloatingLabel>

            <FloatingLabel controlId="fullName" className="mb-3">
              <InputGroup>
                <InputGroup.Text style={{ width: '40px' }}>
                  <FontAwesomeIcon icon={faUser} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  isInvalid={!!errors.fullName}
                  placeholder="Full Name"
                  style={{ paddingLeft: '10px' }}
                />
              </InputGroup>
              {errors.fullName && <Form.Text className="text-danger">{errors.fullName}</Form.Text>}
            </FloatingLabel>

            <FloatingLabel controlId="email" className="mb-3">
              <InputGroup>
                <InputGroup.Text style={{ width: '40px' }}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Email"
                  style={{ paddingLeft: '10px' }}
                />
              </InputGroup>
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </FloatingLabel>

            <FloatingLabel controlId="phone" className="mb-3">
              <InputGroup>
                <InputGroup.Text style={{ width: '40px' }}>
                  <FontAwesomeIcon icon={faPhone} />
                </InputGroup.Text>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  style={{ paddingLeft: '10px' }}
                />
              </InputGroup>
            </FloatingLabel>

            <FloatingLabel controlId="address" className="mb-3">
              <InputGroup>
                <InputGroup.Text style={{ width: '40px' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  style={{ paddingLeft: '10px' }}
                />
              </InputGroup>
            </FloatingLabel>

            <FloatingLabel controlId="password" className="mb-3">
              <InputGroup>
                <InputGroup.Text style={{ width: '40px' }}>
                  <FontAwesomeIcon icon={faLock} />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Password"
                  style={{ paddingLeft: '10px' }}
                />
              </InputGroup>
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </FloatingLabel>

            <FloatingLabel controlId="confirmPassword" className="mb-3">
              <InputGroup>
                <InputGroup.Text style={{ width: '40px' }}>
                  <FontAwesomeIcon icon={faLock} />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  placeholder="Confirm Password"
                  style={{ paddingLeft: '10px' }}
                />
              </InputGroup>
              {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>}
            </FloatingLabel>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="I agree to the Terms and Conditions"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 mb-3">
              Register
            </Button>

            <div className="text-center">
              <span>Already have an account? </span>
              <Link to="/custlog">Login</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Customerreg;