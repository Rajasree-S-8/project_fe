import React, { useState } from 'react';
import './css/AddRooms.css'

function AddRoom() {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    price: '',
    isAvailable: true,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.roomType || !formData.price) {
      setError('All fields are required.');
      setSuccess(false);
      return;
    }
    if (isNaN(formData.price) || formData.price <= 0) {
      setError('Price must be a valid number greater than 0.');
      setSuccess(false);
      return;
    }
    setError('');
    setSuccess(true);
    alert('Room Added:', formData);
    setRooms({
      roomNumber: '',
      roomType: '',
      price: '',
      isAvailable: true,
    });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="container">
      <h1>Add New Room</h1>
      {success && <div className="alert alert-success">Room added successfully!</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="roomNumber" className="form-label">Room Number</label>
          <input
            type="text"
            className="form-control"
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            placeholder="Enter room number"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="roomType" className="form-label">Room Type</label>
          <select
            className="form-select"
            id="roomType"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
          >
            <option value="">Select room type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price per Night(₹)</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="isAvailable">Available</label>
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Room</button>
      </form>
    </div>
  );
}

export default AddRoom;