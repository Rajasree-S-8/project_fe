import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../header/Header.jsx";
import "./AddFood.css";

const AddFood = () => {
  const [foodList, setFoodList] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodRecipe, setFoodRecipe] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFoodList = JSON.parse(localStorage.getItem('foodList')) || [];
    setFoodList(savedFoodList);
  }, []);

  const handleAddFood = () => {
    if (foodName && foodPrice && foodImage && foodDescription) {
      const newFood = {
        id: Date.now(),
        name: foodName,
        price: parseFloat(foodPrice).toFixed(2),
        image: foodImage,
        description: foodDescription,
        recipe: foodRecipe,
        isAvailable,
        createdAt: new Date().toISOString()
      };
      const updatedList = [...foodList, newFood];
      setFoodList(updatedList);
      localStorage.setItem('foodList', JSON.stringify(updatedList));
      
      // Reset form
      setFoodName("");
      setFoodPrice("");
      setFoodImage("");
      setFoodDescription("");
      setFoodRecipe("");
      setIsAvailable(true);
      
      alert("Food item added successfully!");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="add-food-page">
      <Header />
      <div className="container my-5">
        <h1 className="text-center mb-4">Add New Food Item</h1>

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
                onChange={(e) => setFoodImage(e.target.value)}
                required
              />
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
          >
            <i className="fas fa-plus-circle me-2"></i> Add Food Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFood;