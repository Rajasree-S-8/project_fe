import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../header/Header.jsx";
import './EditFood.css';
import axios from "axios";

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurantManager = JSON.parse(localStorage.getItem("restaurantManager"));
  const [foodItem, setFoodItem] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    recipe: '',
    isAvailable: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/food/${id}`);
        setFoodItem(response.data);
      } catch (error) {
        setError("Error fetching food item: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodItem({
      ...foodItem,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.put(`http://localhost:8080/api/food/${id}`, foodItem, {
        headers: { staffId: restaurantManager.staffId },
      });
      navigate('/viewfood');
    } catch (error) {
      setError("Error updating food item: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-food-page">
        <Header />
        <div className="container my-5 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading food item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-food-page">
      <Header />
      <div className="container my-5">
        <button 
          className="btn btn-secondary mb-3 back-btn"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left me-2"></i> Back
        </button>
        
        <h1>Edit Food Item</h1>
        
        {error && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}
        
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
            {foodItem.image && (
              <div className="mt-3">
                <img
                  src={foodItem.image}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxHeight: "200px" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200?text=Image+Not+Found";
                  }}
                />
                <small className="text-muted d-block mt-1">Image Preview</small>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={foodItem.description}
              onChange={handleInputChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Recipe</label>
            <textarea
              className="form-control"
              name="recipe"
              value={foodItem.recipe}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="availabilitySwitch"
                name="isAvailable"
                checked={foodItem.isAvailable}
                onChange={(e) =>
                  setFoodItem({ ...foodItem, isAvailable: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="availabilitySwitch">
                Available
              </label>
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary update-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>Update Food Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFood;