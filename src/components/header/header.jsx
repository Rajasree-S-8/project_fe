import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className="logo" aria-label="GrandVista Hotel Logo">
        GrandVista
      </div>
      <nav aria-label="Primary navigation">
        <ul>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-home me-1"></i> Home
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-info-circle me-1"></i> About
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-bed me-1"></i> Rooms
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-concierge-bell me-1"></i> Services
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-calendar-check me-1"></i> Booking
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="loginDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user me-1"></i> Hotel Login
            </a>
            <ul className="dropdown-menu" aria-labelledby="loginDropdown">
              <li>
                <a className="dropdown-item" href="/admin-login">
                  <i className="fas fa-user-shield me-2"></i> Admin Login
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/customer-login">
                  <i className="fas fa-user me-2"></i> Customer Login
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/hotel-manager-login">
                  <i className="fas fa-hotel me-2"></i> Hotel Manager
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/restaurant-manager-login">
                  <i className="fas fa-utensils me-2"></i> Restaurant Manager
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;