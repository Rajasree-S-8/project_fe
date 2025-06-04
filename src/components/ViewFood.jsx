import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const ViewFood = () => {
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedFoodList = JSON.parse(localStorage.getItem('foodList')) || [];
    setFoodList(savedFoodList);
  }, []);

  const handleDelete = (id) => {
    const updatedList = foodList.filter(food => food.id !== id);
    setFoodList(updatedList);
    localStorage.setItem('foodList', JSON.stringify(updatedList));
  };

  const handleEdit = (id) => {
    navigate(`/edit-food/${id}`);
  };

  const filteredFoodList = foodList.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Food Menu</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>
      </div>
      
      {/* Rest of the ViewFood component remains the same */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              Search
            </button>
          </div>
        </div>
      </div>

      {filteredFoodList.length === 0 ? (
        <div className="text-center py-5">
          <h3>No food items found</h3>
          <p>Add some food items to see them here</p>
        </div>
      ) : (
        <div className="row">
          {filteredFoodList.map((food) => (
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
                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(food.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(food.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFood;