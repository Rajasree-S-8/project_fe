import React, { useState } from 'react';
import { Modal, Form, Button, Alert, FloatingLabel, InputGroup } from 'react-bootstrap';
import { faUser, faEnvelope, faLock, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Forgotpassword = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
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
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) {
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
    console.log('Password reset requested:', formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitted ? (
          <Alert variant="success" className="text-center">
            Password has been reset successfully.
          </Alert>
        ) : (
          <>
            <p className="mb-4 text-center">Enter your details to reset your password.</p>
            <Form onSubmit={handleSubmit} className="px-3">
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
                    isInvalid={!!errors.phone}
                    placeholder="Phone Number"
                    style={{ paddingLeft: '10px' }}
                  />
                </InputGroup>
                {errors.phone && <Form.Text className="text-danger">{errors.phone}</Form.Text>}
              </FloatingLabel>

              <FloatingLabel controlId="newPassword" label="New Password" className="mb-3">
                <InputGroup>
                  <InputGroup.Text style={{ width: '40px' }}>
                    <FontAwesomeIcon icon={faLock} />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.newPassword}
                    placeholder="New Password"
                    style={{ paddingLeft: '10px' }}
                  />
                </InputGroup>
                {errors.newPassword && <Form.Text className="text-danger">{errors.newPassword}</Form.Text>}
              </FloatingLabel>

              <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-4">
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

              <Button variant="primary" type="submit" className="w-100 py-2">
                Reset Password
              </Button>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Forgotpassword;