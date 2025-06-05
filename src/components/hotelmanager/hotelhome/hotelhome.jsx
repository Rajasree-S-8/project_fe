import { useState, useEffect } from 'react';
import './hotelhome.css';
import HeaderNavbar from '../header1/header1';
import AddRoom from '../addrooms/addRooms'; 
import ViewRooms from '../viewrooms/viewroom';
import ViewCustomers from '../viewcustomer/viewcustomer';
import ViewBookings from '../viewbooking/viewbooking';

function Home() {
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem('activeSection');
    return savedSection || 'home';
  });

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="home-content">
            <div className="hotel-image-container">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Luxury Hotel" 
                className="hotel-image"
              />
              <div className="image-overlay"></div>
              <div className="welcome-message">
                <h1>Welcome to Hotel Management</h1>
                <p>Efficiently manage your hotel operations</p>
              </div>
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
    <div className={activeSection === 'home' ? 'home-background' : 'other-section'}>
      <HeaderNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content-container">
        {renderSection()}
      </div>
    </div>
  );
}

export default Home;