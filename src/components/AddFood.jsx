import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


const AddFood = () => {
  const [foodList, setFoodList] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImage, setFoodImage] = useState("");

  const handleAddFood = () => {
    if (foodName && foodPrice && foodImage) {
      const newFood = {
        id: Date.now(),
        name: foodName,
        price: parseFloat(foodPrice).toFixed(2),
        image: foodImage,
      };
      setFoodList([...foodList, newFood]);
      setFoodName("");
      setFoodPrice("");
      setFoodImage("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Restaurant Management</h1>

      {/* Add Food Form */}
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

      {/* Food Cards */}
      <div className="row">
        {foodList.map((food) => (
          <div key={food.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={food.image}
                className="card-img-top"
                alt={food.name}
                style={{ height: "200px", objectFit: "cover" }}
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
