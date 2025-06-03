import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const gotoHome = () => {
    navigate('/');
  };

  const gotAdmin = () => {
    navigate('/Admin');
  };
  const gotHotelManager = () => {
    navigate('/hotelogin');
  }

  return (
    <header>
      <div className="logo" aria-label="Revzz Hotel Logo">
        <i className="fas fa-hotel icon-logo"></i> Revzz Hotel
      </div>
      <nav aria-label="Primary navigation">
        <ul>
          <li>
            <a href="#" onClick={gotoHome} tabIndex="0">
              <i className="fas fa-home icon-home"></i> Home
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-info-circle icon-info"></i> About
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-bed icon-room"></i> Rooms
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-concierge-bell icon-service"></i> Services
            </a>
          </li>
          <li>
            <a href="#" tabIndex="0">
              <i className="fas fa-calendar-check icon-booking"></i> Booking
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="loginDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user icon-login"></i> Hotel Login
            </a>
            <ul className="dropdown-menu" aria-labelledby="loginDropdown">
              <li>
                <a className="dropdown-item" onClick={gotAdmin}>
                  <i className="fas fa-user-shield icon-admin"></i> Admin Login
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/customer-login">
                  <i className="fas fa-user icon-customer"></i> Customer Login
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={gotHotelManager}>
                  <i className="fas fa-hotel icon-manager"></i> Hotel Manager
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/restaurant-manager-login">
                  <i className="fas fa-utensils icon-restaurant"></i> Restaurant Manager
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
