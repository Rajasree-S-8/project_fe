import { useState } from 'react';
import './addrooms.css';

const AddRoom = () => {
  const staffId = localStorage.getItem('staffId');
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    acType: 'AC',
    price: '',
    isAvailable: true,
    imageUrl: ''
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (!staffId || isNaN(staffId)) {
      setError('Invalid or missing Staff ID. Please log in again.');
      setIsLoading(false);
      return;
    }

    if (!formData.roomNumber || !formData.roomType || !formData.price || !formData.acType) {
      setError('All fields are required except image URL.');
      setIsLoading(false);
      return;
    }
    if (isNaN(formData.price) || formData.price <= 0) {
      setError('Price must be a valid number greater than 0.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/rooms/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Staff-Id': staffId
        },
        body: JSON.stringify({
          roomNumber: formData.roomNumber,
          roomType: formData.roomType,
          acType: formData.acType,
          price: parseFloat(formData.price),
          isAvailable: formData.isAvailable,
          imageUrl: formData.imageUrl.trim() || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add room. Please try again.');
      }

      setSuccess(true);
      setFormData({
        roomNumber: '',
        roomType: '',
        acType: 'AC',
        price: '',
        isAvailable: true,
        imageUrl: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
    // Add this state to your component
const [expandedImage, setExpandedImage] = null;

// Add this to your component's return (before the closing </div> of card-body)
{expandedImage && (
  <div className="image-modal" onClick={() => setExpandedImage(null)}>
    <img src={expandedImage} alt="Expanded Preview" className="expanded-image" />
  </div>
)}

// Update your image preview container to this:
{formData.imageUrl.trim() && (
  <div className="image-preview-container">
    <img
      src={formData.imageUrl}
      alt="Image Preview"
      className="img-thumbnail preview-image"
      onClick={() => setExpandedImage(formData.imageUrl)}
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
      }}
    />
    <div className="image-hint">Click to enlarge</div>
  </div>
)}
  };

  return (
    <div className="add-room-page">
      <div className="card add-room-container">
        <div className="card-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px', verticalAlign: 'middle'}}>
              <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="#2c3e50"/>
            </svg>
            Add New Room
          </h2>
        </div>
        <div className="card-body">
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Room added successfully!
              <button type="button" className="btn-close" onClick={() => setSuccess(false)} aria-label="Close"></button>
            </div>
          )}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="roomNumber" className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#495057" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
                    <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11Z"/>
                  </svg>
                  Room Number *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="Enter room number (e.g., 101)"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="roomType" className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#495057" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                    <path d="M17 11V3H7V7H3V21H11V17H13V21H21V11H17ZM7 19H5V17H7V19ZM7 15H5V13H7V15ZM7 11H5V9H7V11ZM11 15H9V13H11V15ZM11 11H9V9H11V11ZM11 7H9V5H11V7ZM15 15H13V13H15V15ZM15 11H13V9H15V11ZM15 7H13V5H15V7ZM19 19H17V17H19V19ZM19 15H17V13H19V15Z"/>
                  </svg>
                  Room Type *
                </label>
                <select
                  className="form-select"
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select room type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Executive">Executive</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#495057" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                    <path d="M6 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3ZM6 5V19H18V5H6Z"/>
                    <path d="M14 8H16V10H14V8ZM14 11H16V13H14V11ZM11 8H13V10H11V8ZM11 11H13V13H11V11ZM8 8H10V10H8V8ZM8 11H10V13H8V11Z"/>
                  </svg>
                  AC Type *
                </label>
                <div className="radio-group">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="acType"
                      id="acTypeAC"
                      value="AC"
                      checked={formData.acType === 'AC'}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="acTypeAC">
                      AC Room
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="acType"
                      id="acTypeNonAC"
                      value="Non-AC"
                      checked={formData.acType === 'Non-AC'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="acTypeNonAC">
                      Non-AC Room
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price per day (₹) *
                </label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="imageUrl" className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#495057" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                  <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"/>
                  <path d="M14.14 11.86L11.14 15.73L9 13.14L6 17H18L14.14 11.86Z"/>
                </svg>
                Room Image (Optional)
              </label>
              <input
                type="url"
                className="form-control"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
              {formData.imageUrl.trim() && (
                <div className="image-preview-container">
                  <img
                    src={formData.imageUrl}
                    alt="Image Preview"
                    className="img-thumbnail preview-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="form-group full-width form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                role="switch"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isAvailable">
                <svg width="16" height="16" viewBox="0 0 24 24" fill={formData.isAvailable ? "#198754" : "#6c757d"} xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
                {formData.isAvailable ? 'Available' : 'Unavailable'}
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle', animation: 'spin 1s linear infinite'}}>
                    <path fillRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" opacity="0.25"/>
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 11.1078 21.8846 10.2424 21.6686 9.41876C21.537 8.92539 20.9483 8.71436 20.5549 9.01834C20.1615 9.32232 19.9816 9.93292 20.1685 10.4188C20.3378 10.8596 20.4643 11.3219 20.5429 11.8C20.6266 12.3086 20.6701 12.8295 20.6701 13.36C20.6701 16.6619 18.332 19.36 15.335 19.36C13.8399 19.36 12.5025 18.5904 11.7566 17.36H14.6701C15.2224 17.36 15.6701 16.9123 15.6701 16.36C15.6701 15.8077 15.2224 15.36 14.6701 15.36H8.67005C8.11777 15.36 7.67005 15.8077 7.67005 16.36V18.36C7.67005 18.9123 8.11777 19.36 8.67005 19.36H9.75664C10.8763 21.0159 13.0285 22 15.335 22C19.4366 22 22.6701 18.7665 22.6701 14.665C22.6701 13.9977 22.5834 13.3505 22.4214 12.7331C22.7375 11.6593 22.8916 10.528 22.8652 9.39047C22.8652 9.39047 22.8652 9.39047 22.8652 9.39047C22.8652 9.39047 22.8652 9.39047 22.8652 9.39047Z"/>
                  </svg>
                  Adding Room...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                  </svg>
                  Add Room
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;