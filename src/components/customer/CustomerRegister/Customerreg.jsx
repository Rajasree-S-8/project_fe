import React, { useState } from 'react';
import { Form, Button, Alert, Card, FloatingLabel, InputGroup } from 'react-bootstrap';
import { faUser, faEnvelope, faLock, faPhone, faMapMarkerAlt, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Customerreg = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    profileImage: null
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
    
    setErrors({});
    setSubmitted(true);
    console.log('Registration submitted:', formData);
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
            Registration successful! You can now login.
          </Alert>}

          <div className="d-flex justify-content-center mb-4">
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
              <Card.Img 
                variant="top" 
                src={imagePreview || "https://via.placeholder.com/100"} 
                className="rounded-circle border border-primary border-3"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="d-none"
                id="profileImage"
              />
              <Button 
                as="label"
                htmlFor="profileImage"
                variant="primary"
                className="rounded-circle position-absolute p-0"
                style={{ 
                  bottom: '0', 
                  right: '0', 
                  width: '30px', 
                  height: '30px',
                  fontSize: '0.8rem'
                }}
              >
                <FontAwesomeIcon icon={faCamera} />
              </Button>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="username" label="Username" className="mb-3">
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

            {/* Repeat similar structure for other fields */}
            <FloatingLabel controlId="fullName" label="Full Name" className="mb-3">
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

            <FloatingLabel controlId="email" label="Email" className="mb-3">
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

            <FloatingLabel controlId="password" label="Password" className="mb-3">
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

            <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-3">
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

            <FloatingLabel controlId="phone" label="Phone Number" className="mb-3">
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

            <FloatingLabel controlId="address" label="Address" className="mb-3">
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