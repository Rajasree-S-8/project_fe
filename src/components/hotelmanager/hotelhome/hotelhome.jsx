import { useState, useEffect } from 'react';
import './hotelhome.css';
import HeaderNavbar from '../header1/header1';
import AddRoom from '../addrooms/addrooms';
import ViewRooms from '../viewrooms/viewroom';
import ViewCustomers from '../viewcustomer/viewcustomer';
import ViewBookings from '../viewbooking/viewbooking';
import Profile from '../profile/profile';

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
            <div className="hotel-hero">
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h1 className="hero-title">Welcome to <span>Revzz Hotel</span></h1>
                <p className="hero-subtitle">Elevating hospitality through seamless management</p>
                
                <div className="stats-container">
                  <div className="stat-card">
                    <div className="stat-icon">🏨</div>
                    <div className="stat-value">120+</div>
                    <div className="stat-label">Rooms Available</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🌟</div>
                    <div className="stat-value">4.9</div>
                    <div className="stat-label">Average Rating</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">5K+</div>
                    <div className="stat-label">Happy Guests</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="features-section">
              <h2 className="section-title">Management Features</h2>
              <div className="features-grid">
                <div className="feature-card" onClick={() => setActiveSection('addRoom')}>
                  <div className="feature-icon">➕</div>
                  <h3>Add Rooms</h3>
                  <p>Easily add new rooms to your inventory with all necessary details.</p>
                </div>
                <div className="feature-card" onClick={() => setActiveSection('viewRooms')}>
                  <div className="feature-icon">🛏️</div>
                  <h3>View Rooms</h3>
                  <p>Manage and view all room details, availability, and status.</p>
                </div>
                <div className="feature-card" onClick={() => setActiveSection('viewCustomers')}>
                  <div className="feature-icon">👤</div>
                  <h3>Customer Management</h3>
                  <p>Track customer information and preferences.</p>
                </div>
                <div className="feature-card" onClick={() => setActiveSection('viewBookings')}>
                  <div className="feature-icon">📅</div>
                  <h3>Booking System</h3>
                  <p>Manage current and upcoming reservations efficiently.</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-buttons">
                <button onClick={() => setActiveSection('addRoom')} className="action-btn primary">
                  Add New Room
                </button>
                <button onClick={() => setActiveSection('viewBookings')} className="action-btn secondary">
                  Check Bookings
                </button>
                <button onClick={() => setActiveSection('viewCustomers')} className="action-btn accent">
                  View Customers
                </button>
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
      case 'profile':
        return <Profile setActiveSection={setActiveSection} />;
      default:
        return null;
    }
  };

  return (
    <div className={`app-container ${activeSection === 'home' ? 'home-active' : ''}`}>
      <HeaderNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default Home;