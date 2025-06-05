import React, { useState } from 'react';
import './admin.css';
import Sidebar from './slidebar/slidebar';
import Dashboard from './dashboard/dashboard';
import AddStaff from './addstaff/addstaff';
import StaffDetails from './staffdetails/staffdetails';
import FoodOrders from './food/food';
import Rooms from './rooms/rooms';
import RatingsReviews from './rating/rating';
import HotelManager from './hotelmanager/hotelmanager';
import RestaurantManager from './restaurantmanager/restaurantmanager';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleNavClick = (e, section) => {
    e.preventDefault();
    setActiveSection(section);
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Hotel Admin Dashboard</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      <link href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" rel="stylesheet" />

      <div className="d-flex">
        <Sidebar activeSection={activeSection} handleNavClick={handleNavClick} />
        <main className="flex-grow-1 p-4">
          <Dashboard isActive={activeSection === 'dashboard'} />
          <AddStaff isActive={activeSection === 'add-staff'} />
          <StaffDetails isActive={activeSection === 'staff-details'} />
          <FoodOrders isActive={activeSection === 'foods'} />
          <Rooms isActive={activeSection === 'rooms'} />
          <RatingsReviews isActive={activeSection === 'ratings-reviews'} />
          <HotelManager isActive={activeSection === 'hotel-manager'} />
          <RestaurantManager isActive={activeSection === 'restaurant-manager'} />
        </main>
      </div>
    </>
  );
};

export default Admin;