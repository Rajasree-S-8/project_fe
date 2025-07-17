import React, { useState } from 'react';
import './admin.css';
import Sidebar from './slidebar/slidebar';
import Dashboard from './dashboard/dashboard';
import AddStaff from './addstaff/addstaff';
import StaffDetails from './staffdetails/staffdetails';
import FoodOrders from './food/food';
import Rooms from './rooms/rooms';
import HotelManager from './hotelmanager/hotelmanager';
import RestaurantManager from './restaurantmanager/restaurantmanager';
import Adcustomer from './Customer/Customer';
import CustomerRoomBook from './Customer/customerroombook';
import CustomerFoodOrders from './Customer/foodorder';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleNavClick = (e, section) => {
    e.preventDefault();
    setActiveSection(section);
  };

  // Map activeSection to the corresponding component
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard isActive={true} />;
      case 'add-staff':
        return <AddStaff isActive={true} />;
      case 'staff-details':
        return <StaffDetails isActive={true} />;
      case 'foods':
        return <FoodOrders isActive={true} />;
      case 'rooms':
        return <Rooms isActive={true} />;
      case 'hotel-manager':
        return <HotelManager isActive={true} />;
      case 'restaurant-manager':
        return <RestaurantManager isActive={true} />;
      case 'customers':
        return <Adcustomer isActive={true} />;
      case 'customer-registrations':
        return <CustomerRoomBook isActive={true} />;
      case 'customer-food-orders':
        return <CustomerFoodOrders isActive={true} />;
      default:
        return <Dashboard isActive={true} />;
    }
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
          {renderActiveSection()}
        </main>
      </div>
    </>
  );
};

export default Admin;