import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddFood = () => {
  const [foodList, setFoodList] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedFoodList = JSON.parse(localStorage.getItem('foodList')) || [];
    setFoodList(savedFoodList);
  }, []);

  const handleAddFood = () => {
    if (foodName && foodPrice && foodImage) {
      const newFood = {
        id: Date.now(),
        name: foodName,
        price: parseFloat(foodPrice).toFixed(2),
        image: foodImage,
      };
      const updatedList = [...foodList, newFood];
      setFoodList(updatedList);
      localStorage.setItem('foodList', JSON.stringify(updatedList));
      setFoodName("");
      setFoodPrice("");
      setFoodImage("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center mb-4">Add New Food Item</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>
      </div>

      {/* Rest of the AddFood component remains the same */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={foodPrice}
            onChange={(e) => setFoodPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Image URL"
            value={foodImage}
            onChange={(e) => setFoodImage(e.target.value)}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary w-100" onClick={handleAddFood}>
            Add Food
          </button>
        </div>
      </div>

      <h2 className="text-center mb-4">Recently Added Items</h2>
      <div className="row">
        {foodList.slice(-3).reverse().map((food) => (
          <div key={food.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={food.image}
                className="card-img-top"
                alt={food.name}
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{food.name}</h5>
                <p className="card-text">Price: ₹{food.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFood;