import React, { useState } from 'react';
import './header1.css';

const HeaderNavbar = ({ activeSection = 'home', setActiveSection }) => {
  const [navbarExpanded, setNavbarExpanded] = useState(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a 
          className="navbar-brand" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('home');
          }}
        >
          <i className="fas fa-hotel icon-logo"></i>
          Hotel Management
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setNavbarExpanded(!navbarExpanded)}
          aria-expanded={navbarExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${navbarExpanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('home');
                }}
              >
                <i className="bi bi-house-door me-1"></i>
                Home
              </a>
            </li>
            
            <li className="nav-item">
              <a 
                className={`nav-link ${activeSection === 'addRoom' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('addRoom');
                }}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Add Room
              </a>
            </li>
            
            <li className="nav-item">
              <a 
                className={`nav-link ${activeSection === 'viewRooms' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('viewRooms');
                }}
              >
                <i className="bi bi-door-closed me-1"></i>
                View Rooms
              </a>
            </li>
            
            <li className="nav-item">
              <a 
                className={`nav-link ${activeSection === 'viewCustomers' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('viewCustomers');
                }}
              >
                <i className="bi bi-people me-1"></i>
                View Customers
              </a>
            </li>
            
            <li className="nav-item">
              <a 
                className={`nav-link ${activeSection === 'viewBookings' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('viewBookings');
                }}
              >
                <i className="bi bi-calendar-check me-1"></i>
                View Bookings
              </a>
            </li>

            {/* Added Ratings & Reviews Section */}
            <li className="nav-item">
              <a 
                className={`nav-link ${activeSection === 'ratingsReviews' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('ratingsReviews');
                }}
              >
                <i className="bi bi-star-fill me-1"></i>
                Ratings & Reviews
              </a>
            </li>
          </ul>
          
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-1"></i>
                Profile
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-person me-2"></i>
                    My Account
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item" href="/">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNavbar;