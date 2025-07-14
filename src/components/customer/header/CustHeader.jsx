import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container, Image, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './CustHeader.css';

const CustHeader = ({ customerName }) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [customer, setCustomer] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const customerData = JSON.parse(localStorage.getItem('customer')) || {};

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerData?.userId) {
        setError('Please log in to view profile.');
        navigate('/custlog', { state: { error: 'Session expired. Please log in again.' } });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8080/api/customers/${customerData.userId}`, {
          headers: {
            'X-Customer-Id': customerData.userId,
          },
        });
        setCustomer(response.data);
        // Update localStorage with fetched data, preserving userId
        localStorage.setItem('customer', JSON.stringify({
          ...customerData,
          ...response.data,
          userId: customerData.userId, // Ensure userId is preserved
        }));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile data.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('customer');
          navigate('/custlog', { state: { error: 'Session expired. Please log in again.' } });
        }
        setLoading(false);
      }
    };

    if (showProfileModal) {
      fetchCustomerData();
    }
  }, [showProfileModal, customerData.userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/custlog');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5048576) {
        setError('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      setImageFile(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!customerData?.userId) {
      setError('Please log in to update profile.');
      navigate('/custlog', { state: { error: 'Session expired. Please log in again.' } });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('fullName', customer.fullName || '');
      formData.append('email', customer.email || '');
      formData.append('phone', customer.phoneNumber || '');
      formData.append('address', customer.address || '');
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(
        `http://localhost:8080/api/customers/update/${customerData.userId}`,
        formData,
        {
          headers: {
            'X-Customer-Id': customerData.userId,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update localStorage with new data, preserving userId
      localStorage.setItem('customer', JSON.stringify({
        ...customerData,
        ...response.data,
        userId: customerData.userId, // Ensure userId is preserved
      }));
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
      setImageFile(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('customer');
        navigate('/custlog', { state: { error: 'Session expired. Please log in again.' } });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="cust-header">
        <Container>
          <Navbar.Brand onClick={() => navigate("/custhome")} style={{ cursor: 'pointer' }}>
            Welcome to Revzz Hotel
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link>
                <Button variant="outline-light" onClick={() => navigate("/custhome")}>
                  Home
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button variant="outline-light" onClick={() => navigate("/custroom")}>
                  Rooms
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button variant="outline-light" onClick={() => navigate("/custfood")}>
                  Food
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button variant="outline-light" onClick={() => navigate("/my-bookings")}>
                  My Bookings
                </Button>
              </Nav.Link>
                  <Nav.Link>
                <Button variant="outline-light" onClick={() => navigate("/my-orders")}>
                  Order
                </Button>
              </Nav.Link>
              <Nav.Link className="profile-section">
                <Button 
                  variant="outline-info" 
                  onClick={() => setShowProfileModal(true)}
                  className="profile-btn"
                >
                  {customerData.image ? (
                    <Image 
                      src={`http://localhost:8080/api/files/${customerData.image}`} 
                      roundedCircle 
                      width="30" 
                      height="30" 
                      className="me-2"
                      onError={(e) => { e.target.src = '/images/profile-placeholder.jpg'; }}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                  )}
                  {customerName || customerData.username || customerData.fullName || 'Profile'}
                </Button>
              </Nav.Link>
              <Nav.Link>
                <Button 
                  variant="danger" 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  <i className="bi bi-box-arrow-left me-2"></i>
                  Logout
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg" className="profile-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="profile-loading">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger" className="profile-error">{error}</Alert>
          ) : (
            <div className={isEditing ? 'edit-mode' : 'view-mode'}>
              {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}
              <div className="profile-image-container">
                {customer.image ? (
                  <Image
                    src={`http://localhost:8080/api/files/${customer.image}`}
                    className="profile-image"
                    alt="Profile"
                    onError={(e) => { e.target.src = '/images/profile-placeholder.jpg'; }}
                  />
                ) : (
                  <div className="profile-icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
              </div>
              <Form onSubmit={handleProfileSubmit} className="profile-form">
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    plaintext
                    readOnly
                    value={customer.username || 'N/A'}
                  />
                </Form.Group>
                {isEditing && (
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={customer.fullName || ''}
                      onChange={handleProfileChange}
                      required
                    />
                  ) : (
                    <Form.Control
                      plaintext
                      readOnly
                      value={customer.fullName || 'N/A'}
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      type="email"
                      name="email"
                      value={customer.email || ''}
                      onChange={handleProfileChange}
                      required
                    />
                  ) : (
                    <Form.Control
                      plaintext
                      readOnly
                      value={customer.email || 'N/A'}
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={customer.phoneNumber || ''}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <Form.Control
                      plaintext
                      readOnly
                      value={customer.phoneNumber || 'N/A'}
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={customer.address || ''}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <Form.Control
                      plaintext
                      readOnly
                      value={customer.address || 'N/A'}
                    />
                  )}
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="profile-actions">
            {!isEditing ? (
              <>
                <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    setImageFile(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleProfileSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustHeader;