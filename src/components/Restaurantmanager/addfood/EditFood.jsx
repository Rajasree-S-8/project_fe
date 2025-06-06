import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../header/Header.jsx";
import './EditFood.css';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState({
    name: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    const foodList = JSON.parse(localStorage.getItem('foodList')) || [];
    const itemToEdit = foodList.find(item => item.id === parseInt(id));
    if (itemToEdit) {
      setFoodItem(itemToEdit);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodItem({
      ...foodItem,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foodList = JSON.parse(localStorage.getItem('foodList')) || [];
    const updatedList = foodList.map(item => 
      item.id === parseInt(id) ? foodItem : item
    );
    localStorage.setItem('foodList', JSON.stringify(updatedList));
    navigate('/viewfood');
  };

  return (
    <div className="edit-food-page">
      <Header />
      <div className="container my-5">
        <h1>Edit Food Item</h1>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="mb-3">
            <label className="form-label">Food Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={foodItem.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={foodItem.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              name="image"
              value={foodItem.image}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            {foodItem.image && (
              <div className="image-preview">
                <img 
                  src={foodItem.image} 
                  alt="Preview" 
                  className="img-thumbnail"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <small className="text-muted">Image Preview</small>
              </div>
            )}
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary update-btn">
              <i className="fas fa-save me-2"></i>Update Food Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFood;