import { useState } from 'react';
import './hotelhome.css';
import HeaderNavbar from '../header1/header1';
import AddRoom from '../addrooms/addRooms'; 
import ViewRooms from '../viewrooms/viewroom';
import ViewCustomers from '../viewcustomer/viewcustomer';
import ViewBookings from '../viewbooking/viewbooking';

function Home() {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="card">
            <div className="card-header">Welcome to Hotel Management System</div>
            <div className="card-body">
              <h5>Manage your hotel efficiently</h5>
              <p>Use the navigation menu to access different features</p>
            </div>
          </div>
        );
      case 'addRoom':
        return <AddRoom />;
      case 'viewRooms':
        return <ViewRooms />;
      case 'viewCustomers':
        return <ViewCustomers />;
      case 'viewBookings':
        return <ViewBookings />;
      default:
        return null;
    }
  };

  return (
    <div className={activeSection === 'home' ? 'home-background' : ''}>
      <HeaderNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="container mt-4">
        {renderSection()}
      </div>
    </div>
  );
}

export default Home;