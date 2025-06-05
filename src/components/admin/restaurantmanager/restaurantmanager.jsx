import React from 'react';

const RestaurantManager = ({ isActive }) => (
  <div id="restaurant-manager" className={`mt-5 ${!isActive ? 'd-none' : ''}`}>
    <h1 className="h3 fw-bold mb-1">Restaurant Manager</h1>
    <p className="text-muted mb-4">Manage Restaurant Managers</p>
    <div className="card shadow-sm">
      <div className="card-body">
        <p>Restaurant Manager content will be populated here.</p>
      </div>
    </div>
  </div>
);

export default RestaurantManager;