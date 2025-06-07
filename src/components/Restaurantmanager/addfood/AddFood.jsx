import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header.jsx";
import "./AddFood.css";
import axios from "axios";

const AddFood = () => {
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodRecipe, setFoodRecipe] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const restaurantManager = JSON.parse(localStorage.getItem("restaurantManager"));

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFoodImage(url);
    setImagePreview(url);
  };

  const handleAddFood = async () => {
    if (!foodName || !foodPrice || !foodImage || !foodDescription) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const newFood = {
        name: foodName,
        price: parseFloat(foodPrice),
        image: foodImage,
        description: foodDescription,
        recipe: foodRecipe,
        isAvailable,
      };
      
      await axios.post("http://localhost:8080/api/food/", newFood, {
        headers: { staffId: restaurantManager.staffId },
      });
      
      navigate("/viewfood");
    } catch (error) {
      console.error("Error adding food:", error);
      setError(error.response?.data?.message || "Failed to add food item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-food-page">
      <Header />
      <div className="container my-5">
        <h1 className="text-center mb-4">Add New Food Item</h1>
        
        {error && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}
        
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Food Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter food name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group mb-3">
              <label className="form-label">Price *</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter price"
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group mb-3">
              <label className="form-label">Image URL *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter image URL"
                value={foodImage}
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="mt-3">
                  <img 
                    src={imagePreview} 
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
          </div>
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                placeholder="Enter food description"
                rows="3"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="form-group mb-3">
              <label className="form-label">Recipe</label>
              <textarea
                className="form-control"
                placeholder="Enter recipe details"
                rows="3"
                value={foodRecipe}
                onChange={(e) => setFoodRecipe(e.target.value)}
              ></textarea>
            </div>
            
            <div className="form-group mb-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availabilitySwitch"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="availabilitySwitch">
                  Available
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <button
            className="btn btn-primary btn-lg add-food-btn"
            onClick={handleAddFood}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle me-2"></i> Add Food Item
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFood;