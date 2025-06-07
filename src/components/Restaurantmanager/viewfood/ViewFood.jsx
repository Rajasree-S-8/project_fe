import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header.jsx";
import "./ViewFood.css";
import axios from "axios";

const ViewFood = () => {
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const restaurantManager = JSON.parse(localStorage.getItem("restaurantManager"));

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/food/staff", {
          headers: { staffId: restaurantManager.staffId },
        });
        setFoodList(response.data);
      } catch (error) {
        setError("Error fetching food items: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoods();
  }, [restaurantManager.staffId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:8080/api/food/${id}`, {
          headers: { staffId: restaurantManager.staffId },
        });
        setFoodList(foodList.filter((food) => food.foodId !== id));
      } catch (error) {
        setError("Error deleting food item: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-food/${id}`);
  };

  const toggleAvailability = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/food/${id}/availability`,
        {},
        {
          headers: { staffId: restaurantManager.staffId },
        }
      );
      setFoodList(
        foodList.map((food) =>
          food.foodId === id ? response.data : food
        )
      );
    } catch (error) {
      setError("Error toggling availability: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredFoodList = foodList.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="view-food-page">
        <Header />
        <div className="container my-5 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading food items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-food-page">
      <Header />
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Food Menu</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/addfood")}
          >
            <i className="fas fa-plus me-2"></i> Add New
          </button>
        </div>
        
        {error && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}
        
        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <div className="input-group search-box">
              <input
                type="text"
                className="form-control"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary search-btn" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        
        {filteredFoodList.length === 0 ? (
          <div className="text-center py-5 no-items">
            <img
              src="https://cdn.dribbble.com/users/1010436/screenshots/6279017/empty-state-dribbble.png"
              alt="No items found"
              className="img-fluid mb-4"
              style={{ maxWidth: "300px" }}
            />
            <h3>No food items found</h3>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/addfood")}
            >
              <i className="fas fa-plus me-2"></i>Add Food Item
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {filteredFoodList.map((food) => (
              <div key={food.foodId} className="col">
                <div className="card h-100 shadow-sm food-card">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={food.image}
                        className="img-fluid rounded-start"
                        alt={food.name}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h5 className="card-title">{food.name}</h5>
                          <span
                            className={`badge ${
                              food.isAvailable ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {food.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                        <p className="card-text text-muted">{food.description}</p>
                        <p className="card-text">
                          <strong>Price:</strong> ₹{food.price}
                        </p>
                        {food.recipe && (
                          <div className="mb-2">
                            <button
                              className="btn btn-sm btn-outline-info"
                              data-bs-toggle="collapse"
                              data-bs-target={`#recipe-${food.foodId}`}
                            >
                              View Recipe
                            </button>
                            <div
                              className="collapse mt-2"
                              id={`recipe-${food.foodId}`}
                            >
                              <div className="card card-body bg-light">
                                {food.recipe}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="d-flex justify-content-between mt-3">
                          <button
                            className="btn btn-sm btn-outline-primary edit-btn"
                            onClick={() => handleEdit(food.foodId)}
                          >
                            <i className="fas fa-edit me-1"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleAvailability(food.foodId)}
                          >
                            {food.isAvailable ? (
                              <>
                                <i className="fas fa-times me-1"></i> Make Unavailable
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check me-1"></i> Make Available
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger delete-btn"
                            onClick={() => handleDelete(food.foodId)}
                          >
                            <i className="fas fa-trash me-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFood;