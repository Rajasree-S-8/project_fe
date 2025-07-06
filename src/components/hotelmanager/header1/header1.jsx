import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './header1.css';

const HeaderNavbar = ({ activeSection = 'home', setActiveSection }) => {
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('staffId');
    localStorage.removeItem('username');
    localStorage.removeItem('activeSection');
    navigate('/hotelogin');
  };

  // Get the first letter of the username or fallback to 'L'
  const profileInitial = username ? username.charAt(0).toUpperCase() : 'L';

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('home');
            }}
          >
            <i className="fas fa-hotel icon-logo"></i> Revzz Hotel
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
                  <i className="bi bi-house-door"></i> Home
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
                  <i className="bi bi-plus-circle"></i> Add Room
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
                  <i className="bi bi-door-closed"></i> View Rooms
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
                  <i className="bi bi-people"></i> View Customers
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
                  <i className="bi bi-calendar-check"></i> View Bookings
                </a>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {username ? (
                    <>
                      <span className="profile-initial">{profileInitial}</span>
                      {username}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-circle"></i> Login
                    </>
                  )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {username ? (
                    <>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveSection('profile');
                          }}
                        >
                          <i className="bi bi-person"></i> Profile
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right"></i> Logout
                        </a>
                      </li>
                    </>
                  ) : (
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/hotelogin');
                        }}
                      >
                        <i className="bi bi-box-arrow-in-right"></i> Login
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderNavbar;