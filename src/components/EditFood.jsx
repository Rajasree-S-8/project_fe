import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Food Item</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/viewfood')}
        >
          Back to Menu
        </button>
      </div>

      <form onSubmit={handleSubmit}>
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
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Update Food Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFood;