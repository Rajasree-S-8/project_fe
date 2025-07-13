import React, { useState, useEffect } from 'react';
import { Button, Container, Card, Alert, Modal, Form, FloatingLabel, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faEdit, faCamera } from '@fortawesome/free-solid-svg-icons';
import CustHeader from '../header/CustHeader';
import axios from 'axios';
import './Customerhome.css';

const Customerhome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [customerData, setCustomerData] = useState(JSON.parse(localStorage.getItem('customer')) || {});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    username: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.fromLogin) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    setFormData({
      fullName: customerData.fullName || '',
      email: customerData.email || '',
      phone: customerData.phoneNumber || '',
      address: customerData.address || '',
      username: customerData.username || ''
    });
  }, [customerData]);

  const handleProfileShow = () => setShowProfileModal(true);
  const handleProfileClose = () => {
    setShowProfileModal(false);
    setEditMode(false);
    setErrors({});
    setNewImage(null);
    setPreviewImage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    return newErrors;
  };

  const handleSaveProfile = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('address', formData.address || '');
      if (newImage) {
        formDataToSend.append('image', newImage);
      }

      const response = await axios.put(
        `http://localhost:8080/api/customers/update/${customerData.userId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const updatedCustomer = { ...customerData, ...response.data };
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      setCustomerData(updatedCustomer);
      setEditMode(false);
      setNewImage(null);
      setPreviewImage('');
      setErrors({});
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ 
        api: error.response?.data?.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustHeader customerName={customerData.fullName} onProfileClick={handleProfileShow} />
      
      <div className="customer-home-container">
        {showWelcome && (
          <Alert 
            variant="success" 
            className="welcome-alert"
            onClose={() => setShowWelcome(false)} 
            dismissible
          >
            Welcome {customerData.fullName}! You have successfully logged in.
          </Alert>
        )}

        <Container className="home-content">
          <Card className="welcome-card">
            <Card.Body>
              <Card.Title as="h1" className="welcome-title">
                Welcome, {customerData.fullName}!
              </Card.Title>
              <Card.Text as="h3" className="welcome-subtitle">
                Experience Luxury Like Never Before
              </Card.Text>
              
              <div className="action-buttons">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="action-btn"
                  onClick={() => navigate('/custroom')}
                >
                  Explore Our Rooms
                </Button>
                <Button 
                  variant="success" 
                  size="lg" 
                  className="action-btn"
                  onClick={() => navigate('/custfood')}
                >
                  Discover Our Restaurant
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>

        {/* Profile Modal */}
        <Modal show={showProfileModal} onHide={handleProfileClose} centered className="profile-modal">
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Profile' : 'Your Profile'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errors.api && <Alert variant="danger">{errors.api}</Alert>}
            
            <Form>
              {/* Profile Picture */}
              <div className="text-center mb-4">
                <div className="profile-picture-container mx-auto">
                  {previewImage ? (
                    <img 
                      src={previewImage}
                      alt="Profile Preview"
                      className="profile-picture"
                    />
                  ) : customerData.image ? (
                    <img 
                      src={`http://localhost:8080/api/files/${customerData.image}`}
                      alt="Profile"
                      className="profile-picture"
                    />
                  ) : (
                    <div className="profile-picture-placeholder">
                      <FontAwesomeIcon icon={faUser} size="3x" />
                    </div>
                  )}
                  {editMode && (
                    <>
                      <label htmlFor="profilePictureUpload" className="camera-icon">
                        <FontAwesomeIcon icon={faCamera} />
                      </label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                        id="profilePictureUpload"
                      />
                    </>
                  )}
                </div>
                {editMode && (
                  <div className="text-muted small mt-2">
                    Click on the camera icon to change photo
                  </div>
                )}
              </div>

              {/* Username */}
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.username}
                  readOnly
                  plaintext
                />
              </Form.Group>

              {/* Full Name */}
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faUser} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    isInvalid={!!errors.fullName}
                  />
                </InputGroup>
                {errors.fullName && <Form.Text className="text-danger">{errors.fullName}</Form.Text>}
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    isInvalid={!!errors.email}
                  />
                </InputGroup>
                {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
              </Form.Group>

              {/* Phone Number */}
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faPhone} />
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                  />
                </InputGroup>
              </Form.Group>

              {/* Address */}
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    rows={3}
                  />
                </InputGroup>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {editMode ? (
              <>
                <Button variant="outline-secondary" onClick={() => {
                  setEditMode(false);
                  setNewImage(null);
                  setPreviewImage('');
                  setErrors({});
                }}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-secondary" onClick={handleProfileClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit Profile
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Customerhome;