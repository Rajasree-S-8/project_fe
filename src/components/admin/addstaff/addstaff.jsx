// src/components/addstaff/addstaff.jsx
import React, { useState } from 'react';
import './AddStaff.css';

const AddStaff = ({ isActive, onStaffAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    address: '',
    Age: '',
    phoneNumber: '',
    password: '',
    role: '',
    image: null
  });
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [imageError, setImageError] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setImageError('Please upload a valid image (JPEG, PNG, or GIF)');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setImageError('Image size must be less than 5MB');
          return;
        }
        setImageError('');
        setFormData(prev => ({
          ...prev,
          image: file
        }));
      }
      return;
    }

    if (name === 'phoneNumber') {
      if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return;
    }

    if (name === 'email') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (value.length > 0) {
        validateEmail(value);
      } else {
        setEmailError('');
      }
      return;
    }

    if (name === 'password') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (value.length > 0) {
        validatePassword(value);
      } else {
        setPasswordError('');
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., user@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
    if (!regex.test(password)) {
      setPasswordError('Password must be 8-50 characters with at least one uppercase, one lowercase, one number, and one special character');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setIsSubmitting(true);

    const requiredFields = ['username', 'fullName', 'email', 'address', 'Age', 'phoneNumber', 'password', 'role'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.phoneNumber.length !== 10) {
      showNotification('Phone number must be exactly 10 digits', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setShowPasswordPopup(true);
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('staff', new Blob([JSON.stringify({
      username: formData.username,
      fullname: formData.fullName,
      email: formData.email,
      address: formData.address,
      age: parseInt(formData.Age),
      phonenumber: formData.phoneNumber,
      password: formData.password,
      role: formData.role
    })], { type: 'application/json' }));
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:8080/api/staff/add', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add staff');
      }

      showNotification('Staff added successfully!', 'success');
      setFormData({
        username: '',
        fullName: '',
        email: '',
        address: '',
        Age: '',
        phoneNumber: '',
        password: '',
        role: '',
        image: null
      });
      setPasswordError('');
      setEmailError('');
      setImageError('');
      setShowPasswordPopup(false);
      setSubmitAttempted(false);
      if (onStaffAdded) onStaffAdded();
    } catch (error) {
      console.error('Error:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `staff-${type}-notification show`;
    notification.innerHTML = `
      <div className="notification-content">
        <i className="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const isPasswordValid = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
    return regex.test(formData.password);
  };

  if (!isActive) return null;

  return (
    <div id="add-staff" className="add-staff-container">
      <div className="add-staff-header">
        <h1 className="add-staff-title">Add New Staff Member</h1>
        <p className="add-staff-subtitle">Fill in the details below to register a new staff member</p>
      </div>
      <div className="add-staff-card">
        <div className="add-staff-card-body">
          <form onSubmit={handleSubmit} className="add-staff-form">
            <div className="add-staff-form-grid">
              <div className="add-staff-form-group">
                <label htmlFor="username" className="add-staff-label">
                  <i className="fas fa-user-tie"></i> Username
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="text"
                    className="add-staff-input"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                  <div className="input-underline"></div>
                </div>
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="fullName" className="add-staff-label">
                  <i className="fas fa-id-card"></i> Full Name
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="text"
                    className="add-staff-input"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                  <div className="input-underline"></div>
                </div>
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="email" className="add-staff-label">
                  <i className="fas fa-envelope"></i> Email
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="email"
                    className={`add-staff-input ${emailError ? 'input-error' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                  <div className="input-underline"></div>
                </div>
                {emailError && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {emailError}
                  </div>
                )}
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="address" className="add-staff-label">
                  <i className="fas fa-map-marker-alt"></i> Address
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="text"
                    className="add-staff-input"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    required
                  />
                  <div className="input-underline"></div>
                </div>
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="Age" className="add-staff-label">
                  <i className="fas fa-birthday-cake"></i> Age
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="number"
                    className="add-staff-input"
                    id="Age"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="18"
                    max="100"
                    required
                  />
                  <div className="input-underline"></div>
                </div>
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="phoneNumber" className="add-staff-label">
                  <i className="fas fa-phone"></i> Phone Number
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="tel"
                    className="add-staff-input"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    required
                  />
                  <div className="input-underline"></div>
                </div>
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="password" className="add-staff-label">
                  <i className="fas fa-key"></i> Password
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="password"
                    className={`add-staff-input ${passwordError && submitAttempted ? 'input-error' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    minLength="8"
                    maxLength="50"
                    required
                  />
                  <div className="input-underline"></div>
                </div>
                {passwordError && submitAttempted && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {passwordError}
                  </div>
                )}
                {showPasswordPopup && !isPasswordValid() && (
                  <div className="password-requirements-popup">
                    <div className="popup-header">
                      <i className="fas fa-shield-alt"></i> Password Requirements
                    </div>
                    <ul className="requirements-list">
                      <li className={formData.password.length >= 8 && formData.password.length <= 50 ? 'valid' : 'invalid'}>
                        <i className={`fas ${formData.password.length >= 8 && formData.password.length <= 50 ? 'fa-check' : 'fa-times'}`}></i>
                        8-50 characters
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? 'valid' : 'invalid'}>
                        <i className={`fas ${/[A-Z]/.test(formData.password) ? 'fa-check' : 'fa-times'}`}></i>
                        At least one uppercase letter
                      </li>
                      <li className={/[a-z]/.test(formData.password) ? 'valid' : 'invalid'}>
                        <i className={`fas ${/[a-z]/.test(formData.password) ? 'fa-check' : 'fa-times'}`}></i>
                        At least one lowercase letter
                      </li>
                      <li className={/\d/.test(formData.password) ? 'valid' : 'invalid'}>
                        <i className={`fas ${/\d/.test(formData.password) ? 'fa-check' : 'fa-times'}`}></i>
                        At least one number
                      </li>
                      <li className={/[@$!%*?&]/.test(formData.password) ? 'valid' : 'invalid'}>
                        <i className={`fas ${/[@$!%*?&]/.test(formData.password) ? 'fa-check' : 'fa-times'}`}></i>
                        At least one special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="role" className="add-staff-label">
                  <i className="fas fa-user-tag"></i> Role
                </label>
                <div className="add-staff-input-container">
                  <select
                    className="add-staff-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select staff role</option>
                    <option value="Hotel Manager">Hotel Manager</option>
                    <option value="Restaurant Manager">Restaurant Manager</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="input-underline"></div>
                </div>
              </div>
              <div className="add-staff-form-group">
                <label htmlFor="image" className="add-staff-label">
                  <i className="fas fa-image"></i> Profile Image
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="file"
                    className={`add-staff-input ${imageError ? 'input-error' : ''}`}
                    id="image"
                    name="image"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleChange}
                  />
                  <div className="input-underline"></div>
                </div>
                {imageError && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {imageError}
                  </div>
                )}
              </div>
            </div>
            <div className="add-staff-actions">
              <button
                type="submit"
                className="add-staff-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i> Add Staff Member
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;