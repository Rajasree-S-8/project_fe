import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Card, FloatingLabel, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './CustomerReg.css';

const CustomerReg = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    imageFile: null,
    previewImage: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image
      if (!file.type.match('image.*')) {
        setErrors({ ...errors, image: 'Please select an image file' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors({ ...errors, image: 'Image size must be less than 5MB' });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          previewImage: reader.result
        });
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      const response = await axios.post('http://localhost:8080/api/customers/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Redirect to login with success state
      navigate('/custlog', { 
        state: { 
          registrationSuccess: true,
          registeredEmail: formData.email 
        } 
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.status === 409) {
        errorMessage = error.response.data || 'Email or username already exists';
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      }
      setErrors({ api: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <Card className="registration-card">
        <Card.Body>
          <h2 className="text-center mb-4">Create Account</h2>

          {errors.api && (
            <Alert variant="danger" onClose={() => setErrors({...errors, api: ''})} dismissible>
              {errors.api}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!errors.image}
                  />
                  {errors.image && (
                    <Form.Text className="text-danger">{errors.image}</Form.Text>
                  )}
                  {formData.previewImage && (
                    <div className="mt-2 text-center">
                      <img
                        src={formData.previewImage}
                        alt="Preview"
                        className="preview-image"
                      />
                    </div>
                  )}
                </Form.Group>

                <FloatingLabel controlId="username" label="Username" className="mb-3">
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="Username"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel controlId="fullName" label="Full Name" className="mb-3">
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    isInvalid={!!errors.fullName}
                    placeholder="Full Name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel controlId="email" label="Email" className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>

              <Col md={6}>
                <FloatingLabel controlId="phone" label="Phone Number (Optional)" className="mb-3">
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                </FloatingLabel>

                <FloatingLabel controlId="address" label="Address (Optional)" className="mb-3">
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </FloatingLabel>

                <FloatingLabel controlId="password" label="Password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Confirm Password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Check
                required
                label="I agree to the Terms and Conditions"
                feedback="You must agree before submitting."
                feedbackType="invalid"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 mb-3"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
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

export default CustomerReg;