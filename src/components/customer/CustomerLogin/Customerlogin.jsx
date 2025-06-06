import React, { useState } from 'react';
import { Form, Button, Alert, Card, FloatingLabel, InputGroup } from 'react-bootstrap';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import Forgotpassword from '../ForgotPass/Forgotpassword';

const Customerlogin = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
    
    setErrors({});
    setSubmitted(true);
    console.log('Login submitted:', formData);
  };

  return (
    <>
      <div style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80")',
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
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}></div>
        <Card className="p-4 border-0 shadow" style={{ maxWidth: '400px', width: '100%', zIndex: 2 }}>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            
            {submitted && <Alert variant="success" dismissible onClose={() => setSubmitted(false)}>
              Login successful! Redirecting...
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

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check type="checkbox" label="Remember me" />
                <Button 
                  variant="link" 
                  onClick={() => setShowForgotPassword(true)} 
                  className="p-0 text-decoration-none"
                >
                  Forgot password?
                </Button>
              </div>

              <Button variant="primary" type="submit" className="w-100 py-2 mb-3" onClick={()=>navigate('/')}> 
                Login
              </Button>

              <div className="text-center">
                <span>Don't have an account? </span>
                <Link to="/custreg">Register Here</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <Forgotpassword
        show={showForgotPassword} 
        onHide={() => setShowForgotPassword(false)} 
      />
    </>
  );
};

export default Customerlogin;