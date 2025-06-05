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
          imageUrl: formData.imageUrl || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add room. Please try again.');
      }

      const data = await response.json();
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
  };

  return (
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
            <button type="button" className="btn-close" onClick={() => setSuccess(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        )}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="roomNumber" className="form-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#495057"/>
                <path d="M13 7H11V13H17V11H13V7Z" fill="#495057"/>
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
          
          <div className="mb-3">
            <label htmlFor="roomType" className="form-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path d="M17 11V3H7V7H3V21H11V17H13V21H21V11H17ZM7 19H5V17H7V19ZM7 15H5V13H7V15ZM7 11H5V9H7V11ZM11 15H9V13H11V15ZM11 11H9V9H11V11ZM11 7H9V5H11V7ZM15 15H13V13H15V15ZM15 11H13V9H15V11ZM15 7H13V5H15V7ZM19 19H17V17H19V19ZM19 15H17V13H19V15Z" fill="#495057"/>
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
          
          <div className="mb-3">
            <label className="form-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path d="M12 4C7.31 4 3.5 7.31 3.5 12C3.5 16.69 7.31 20 12 20C16.69 20 20.5 16.69 20.5 12C20.5 7.31 16.69 4 12 4ZM12 18C8.42 18 5.5 15.08 5.5 12C5.5 8.92 8.42 6 12 6C15.58 6 18.5 8.92 18.5 12C18.5 15.08 15.58 18 12 18Z" fill="#495057"/>
                <path d="M19 14H5V12H19V14Z" fill="#495057"/>
              </svg>
              AC Type *
            </label>
            <div className="d-flex gap-3">
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
          
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#495057"/>
                <path d="M12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10ZM12 12C13.1 12 14 12.9 14 14C14 15.1 13.1 16 12 16C10.9 16 10 15.1 10 14C10 12.9 10.9 12 12 12Z" fill="#495057"/>
              </svg>
              Price per day *
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </span>
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
          
          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#495057"/>
                <path d="M14.14 11.86L11.14 15.73L9 13.14L6 17H18L14.14 11.86Z" fill="#495057"/>
              </svg>
              Room Image URL (Optional)
            </label>
            <input
              type="url"
              className="form-control"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/room-image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Room preview" 
                  className="img-thumbnail preview-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <small className="text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '4px', verticalAlign: 'text-top'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#6c757d"/>
                    <path d="M11 16H13V11H11V16ZM12 9C12.55 9 13 8.55 13 8C13 7.45 12.55 7 12 7C11.45 7 11 7.45 11 8C11 8.55 11.45 9 12 9Z" fill="#6c757d"/>
                  </svg>
                  Image preview
                </small>
              </div>
            )}
          </div>
          
          <div className="mb-3 form-check form-switch">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'text-top'}}>
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill={formData.isAvailable ? "#198754" : "#6c757d"}/>
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle', animation: 'spin 1s linear infinite'}}>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="#ffffff" opacity="0.25"/>
                  <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.1078 21.8846 10.2424 21.6686 9.41876C21.537 8.92539 20.9483 8.71436 20.5549 9.01834C20.1615 9.32232 19.9816 9.93292 20.1685 10.4188C20.3378 10.8596 20.4643 11.3219 20.5429 11.8C20.6266 12.3086 20.6701 12.8295 20.6701 13.36C20.6701 16.6619 18.332 19.36 15.335 19.36C13.8399 19.36 12.5025 18.5904 11.7566 17.36H14.6701C15.2224 17.36 15.6701 16.9123 15.6701 16.36C15.6701 15.8077 15.2224 15.36 14.6701 15.36H8.67005C8.11777 15.36 7.67005 15.8077 7.67005 16.36V18.36C7.67005 18.9123 8.11777 19.36 8.67005 19.36H9.75664C10.8763 21.0159 13.0285 22 15.335 22C19.4366 22 22.6701 18.7665 22.6701 14.665C22.6701 13.9977 22.5834 13.3505 22.4214 12.7331C22.7375 11.6593 22.8916 10.528 22.8652 9.39047C22.8652 9.39047 22.8652 9.39047 22.8652 9.39047C22.8652 9.39047 22.8652 9.39047 22.8652 9.39047Z" fill="#ffffff"/>
                </svg>
                Adding Room...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
                </svg>
                Add Room
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;