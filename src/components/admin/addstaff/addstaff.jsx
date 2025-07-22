import React, { useState, useEffect } from 'react';
import './AddStaff.css';

const AddStaff = ({ isActive, onStaffAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    address: '',
    dateOfBirth: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    joiningDate: '',
    experience: '',
    qualification: '',
    age: '',
    image: null
  });

  const [errors, setErrors] = useState({
    username: '',
    fullName: '',
    email: '',
    address: '',
    dateOfBirth: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    joiningDate: '',
    experience: '',
    qualification: '',
    age: '',
    image: ''
  });

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'username':
        if (!value.trim()) error = 'Username is required';
        else if (value.length < 3) error = 'Username must be at least 3 characters';
        break;
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (!/^[a-zA-Z ]+$/.test(value)) error = 'Full name should contain only letters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) 
          error = 'Please enter a valid email address';
        break;
      case 'phoneNumber':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Phone number must be 10 digits';
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/.test(value)) {
          error = 'Password must be 8-50 characters with uppercase, lowercase, number, and special character';
          setShowPasswordPopup(true);
        } else {
          setShowPasswordPopup(false);
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'age':
        if (!value) error = 'Age is required';
        else if (value < 18) error = 'Staff must be at least 18 years old';
        else if (value > 100) error = 'Please enter a valid age';
        break;
      case 'experience':
        if (!value) error = 'Experience is required';
        else if (value < 0) error = 'Experience cannot be negative';
        else if (value > 50) error = 'Please enter a valid experience';
        break;
      case 'dateOfBirth':
      case 'joiningDate':
        if (!value) error = 'This field is required';
        break;
      default:
        if (!value) error = 'This field is required';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      let error = '';
      
      if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          error = 'Please upload a valid image (JPEG, PNG, or GIF)';
        } else if (file.size > 5 * 1024 * 1024) {
          error = 'Image size must be less than 5MB';
        }
      }

      setErrors(prev => ({ ...prev, [name]: error }));
      setFormData(prev => ({
        ...prev,
        [name]: error ? null : file
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (submitAttempted) {
      validateField(name, value);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(formData).forEach(key => {
      if (key !== 'image') { // Image is optional
        if (!validateField(key, formData[key])) {
          isValid = false;
        }
      }
    });

    // Additional validation for dates
    if (formData.dateOfBirth && formData.joiningDate) {
      const dob = new Date(formData.dateOfBirth);
      const joinDate = new Date(formData.joiningDate);
      
      if (joinDate < dob) {
        newErrors.joiningDate = 'Joining date cannot be before date of birth';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('staff', new Blob([JSON.stringify({
      username: formData.username,
      fullname: formData.fullName,
      email: formData.email,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      phonenumber: formData.phoneNumber,
      password: formData.password,
      role: formData.role,
      joiningDate: formData.joiningDate,
      experience: parseInt(formData.experience),
      qualification: formData.qualification,
      age: parseInt(formData.age)
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

      setShowSuccess(true);
      showNotification('Staff added successfully!', 'success');
      
      // Reset form
      setFormData({
        username: '',
        fullName: '',
        email: '',
        address: '',
        dateOfBirth: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: '',
        joiningDate: '',
        experience: '',
        qualification: '',
        age: '',
        image: null
      });
      setErrors({
        username: '',
        fullName: '',
        email: '',
        address: '',
        dateOfBirth: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: '',
        joiningDate: '',
        experience: '',
        qualification: '',
        age: '',
        image: ''
      });
      setSubmitAttempted(false);
      setShowPasswordPopup(false);
      
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
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
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
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-message animate__animated animate__bounceIn">
            <div className="success-icon">
              <svg viewBox="0 0 76 76" className="success-icon-circle">
                <circle cx="38" cy="38" r="36" className="circle-bg"/>
                <path d="M17.7,40.9l10.9,10.9l28.7-28.7" className="checkmark"/>
              </svg>
            </div>
            <h2>Staff Registration Successful!</h2>
            <p>The new staff member has been added to the system.</p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="success-close-btn"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="add-staff-header">
        <h1 className="add-staff-title">Add New Staff Member</h1>
        <p className="add-staff-subtitle">Fill in the details below to register a new staff member</p>
      </div>
      
      <div className="add-staff-card">
        <div className="add-staff-card-body">
          <form onSubmit={handleSubmit} className="add-staff-form">
            <div className="add-staff-form-grid">
              {/* Username */}
              <div className="add-staff-form-group">
                <label htmlFor="username" className="add-staff-label">
                  <i className="fas fa-user-tie"></i> Username
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="text"
                    className={`add-staff-input ${errors.username ? 'input-error' : ''}`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.username && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.username}
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div className="add-staff-form-group">
                <label htmlFor="fullName" className="add-staff-label">
                  <i className="fas fa-id-card"></i> Full Name
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="text"
                    className={`add-staff-input ${errors.fullName ? 'input-error' : ''}`}
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.fullName && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="add-staff-form-group">
                <label htmlFor="email" className="add-staff-label">
                  <i className="fas fa-envelope"></i> Email
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="email"
                    className={`add-staff-input ${errors.email ? 'input-error' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.email && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.email}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="add-staff-form-group">
                <label htmlFor="address" className="add-staff-label">
                  <i className="fas fa-map-marker-alt"></i> Address
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="text"
                    className={`add-staff-input ${errors.address ? 'input-error' : ''}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter street address"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.address && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.address}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="add-staff-form-group">
                <label htmlFor="dateOfBirth" className="add-staff-label">
                  <i className="fas fa-birthday-cake"></i> Date of Birth
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="date"
                    className={`add-staff-input ${errors.dateOfBirth ? 'input-error' : ''}`}
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.dateOfBirth && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.dateOfBirth}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="add-staff-form-group">
                <label htmlFor="phoneNumber" className="add-staff-label">
                  <i className="fas fa-phone"></i> Phone Number
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="tel"
                    className={`add-staff-input ${errors.phoneNumber ? 'input-error' : ''}`}
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.phoneNumber && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.phoneNumber}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="add-staff-form-group">
                <label htmlFor="password" className="add-staff-label">
                  <i className="fas fa-key"></i> Password
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="password"
                    className={`add-staff-input ${errors.password ? 'input-error' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    minLength="8"
                    maxLength="50"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.password && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.password}
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

              {/* Confirm Password */}
              <div className="add-staff-form-group">
                <label htmlFor="confirmPassword" className="add-staff-label">
                  <i className="fas fa-key"></i> Confirm Password
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="password"
                    className={`add-staff-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    minLength="8"
                    maxLength="50"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.confirmPassword && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="add-staff-form-group">
                <label htmlFor="role" className="add-staff-label">
                  <i className="fas fa-user-tag"></i> Role
                </label>
                <div className="add-staff-input-container">
                  <select
                    className={`add-staff-select ${errors.role ? 'input-error' : ''}`}
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select staff role</option>
                    <option value="Hotel Manager">Hotel Manager</option>
                    <option value="Restaurant Manager">Restaurant Manager</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="input-underline"></div>
                </div>
                {errors.role && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.role}
                  </div>
                )}
              </div>

              {/* Joining Date */}
              <div className="add-staff-form-group">
                <label htmlFor="joiningDate" className="add-staff-label">
                  <i className="fas fa-calendar-alt"></i> Joining Date
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="date"
                    className={`add-staff-input ${errors.joiningDate ? 'input-error' : ''}`}
                    id="joiningDate"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    min={formData.dateOfBirth || ''}
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.joiningDate && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.joiningDate}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="add-staff-form-group">
                <label htmlFor="experience" className="add-staff-label">
                  <i className="fas fa-briefcase"></i> Experience (Years)
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="number"
                    className={`add-staff-input ${errors.experience ? 'input-error' : ''}`}
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    min="0"
                    max="50"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.experience && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.experience}
                  </div>
                )}
              </div>

              {/* Qualification */}
              <div className="add-staff-form-group">
                <label htmlFor="qualification" className="add-staff-label">
                  <i className="fas fa-graduation-cap"></i> Qualification
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="text"
                    className={`add-staff-input ${errors.qualification ? 'input-error' : ''}`}
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="Enter highest qualification"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.qualification && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.qualification}
                  </div>
                )}
              </div>

              {/* Age */}
              <div className="add-staff-form-group">
                <label htmlFor="age" className="add-staff-label">
                  <i className="fas fa-user"></i> Age
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="number"
                    className={`add-staff-input ${errors.age ? 'input-error' : ''}`}
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="18"
                    max="100"
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.age && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.age}
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="add-staff-form-group">
                <label htmlFor="image" className="add-staff-label">
                  <i className="fas fa-image"></i> Profile Image
                </label>
                <div className="add-staff-input-container">
                  <input
                    type="file"
                    className={`add-staff-input ${errors.image ? 'input-error' : ''}`}
                    id="image"
                    name="image"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleChange}
                  />
                  <div className="input-underline"></div>
                </div>
                {errors.image && (
                  <div className="input-error-message">
                    <i className="fas fa-exclamation-circle"></i> {errors.image}
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