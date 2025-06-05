import React, { useState } from 'react';

const AddStaff = ({ isActive, onStaffAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    address: '',
    Age: '',
    phoneNumber: '',
    password: '',
    role: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    // Validate all required fields
    const requiredFields = ['username', 'fullName', 'email', 'address', 'Age', 'phoneNumber', 'password', 'role'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    // Validate phone number
    if (formData.phoneNumber.length !== 10) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      return;
    }

    // Validate password strength
    if (!validatePassword(formData.password)) {
      setShowPasswordPopup(true);
      return;
    }

    const backendFormData = {
      username: formData.username,
      fullname: formData.fullName,
      email: formData.email,
      address: formData.address,
      age: parseInt(formData.Age),
      phonenumber: formData.phoneNumber, // Keep as string
      password: formData.password,
      role: formData.role
    };

    try {
      const response = await fetch('http://localhost:8080/api/staff/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add staff');
      }

      const result = await response.json();
      alert('Staff added successfully!');
      setFormData({
        username: '',
        fullName: '',
        email: '',
        address: '',
        Age: '',
        phoneNumber: '',
        password: '',
        role: ''
      });
      setPasswordError('');
      setEmailError('');
      setShowPasswordPopup(false);
      setSubmitAttempted(false);
      if (onStaffAdded) onStaffAdded();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const isPasswordValid = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
    return regex.test(formData.password);
  };

  return (
    <div id="add-staff" className={`mt-5 ${!isActive ? 'd-none' : ''}`}>
      <h1 className="h3 fw-bold mb-1">Add Staff</h1>
      <p className="text-muted mb-4">Add a new staff member</p>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="username" className="form-label">
                  <i className="fas fa-user me-2"></i>
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    name="username" 
                    value={formData.username}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="fullName" className="form-label">
                  <i className="fas fa-id-card me-2"></i>
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-id-card"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  <i className="fas fa-envelope me-2"></i>
                  Email
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                {emailError && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {emailError}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="address" className="form-label">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Address
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-map-marker-alt"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="Age" className="form-label">
                  <i className="fas fa-birthday-cake me-2"></i>
                  Age
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-birthday-cake"></i>
                  </span>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="Age" 
                    name="Age" 
                    value={formData.Age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    required 
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  <i className="fas fa-phone me-2"></i>
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-phone"></i>
                  </span>
                  <input 
                    type="tel" 
                    className="form-control" 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength="10"
                    required 
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock me-2"></i>
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input 
                    type="password" 
                    className={`form-control ${passwordError && submitAttempted ? 'is-invalid' : ''}`}
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
                    maxLength="50"
                    required 
                  />
                </div>
                {passwordError && submitAttempted && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {passwordError}
                  </div>
                )}
                
                {showPasswordPopup && !isPasswordValid() && (
                  <div className="card mt-2 shadow-sm">
                    <div className="card-body p-3">
                      <h6 className="card-title mb-2">Password Requirements:</h6>
                      <ul className="mb-0 small">
                        <li className={formData.password.length >= 8 && formData.password.length <= 50 ? 'text-success' : 'text-danger'}>
                          {formData.password.length >= 8 && formData.password.length <= 50 ? '✓' : '✗'} 8-50 characters
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'text-success' : 'text-danger'}>
                          {/[A-Z]/.test(formData.password) ? '✓' : '✗'} At least one uppercase letter (A-Z)
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'text-success' : 'text-danger'}>
                          {/[a-z]/.test(formData.password) ? '✓' : '✗'} At least one lowercase letter (a-z)
                        </li>
                        <li className={/\d/.test(formData.password) ? 'text-success' : 'text-danger'}>
                          {/\d/.test(formData.password) ? '✓' : '✗'} At least one number (0-9)
                        </li>
                        <li className={/[@$!%*?&]/.test(formData.password) ? 'text-success' : 'text-danger'}>
                          {/[@$!%*?&]/.test(formData.password) ? '✓' : '✗'} At least one special character (@$!%*?&)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="role" className="form-label">
                  <i className="fas fa-user-tag me-2"></i>
                  Role
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user-tag"></i>
                  </span>
                  <select 
                    className="form-select" 
                    id="role" 
                    name="role" 
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a role</option>
                    <option value="Hotel Manager">Hotel Manager</option>
                    <option value="Restaurant Manager">Restaurant Manager</option>         
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-user-plus me-2"></i>
              Add Staff
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;