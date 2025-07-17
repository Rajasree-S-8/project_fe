import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './header1.css';

const HeaderNavbar = () => {
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('staffId');
    localStorage.removeItem('username');
    navigate('/hotelogin');
  };

  const profileInitial = username ? username.charAt(0).toUpperCase() : 'L';

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/hotelhome">
            <i className="fas fa-hotel icon-logo"></i> Revzz Hotel
          </Link>

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
                <Link 
                  className={`nav-link ${isActive('/hotelhome') ? 'active' : ''}`} 
                  to="/hotelhome"
                >
                  <i className="bi bi-house-door"></i> Home
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/hotel/addroom') ? 'active' : ''}`} 
                  to="/hotel/addroom"
                >
                  <i className="bi bi-plus-circle"></i> Add Room
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/hotel/viewrooms') ? 'active' : ''}`} 
                  to="/hotel/viewrooms"
                >
                  <i className="bi bi-door-closed"></i> View Rooms
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/hotel/viewcustomers') ? 'active' : ''}`} 
                  to="/hotel/viewcustomers"
                >
                  <i className="bi bi-people"></i> View Customers
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/hotel/view-bookings') ? 'active' : ''}`} 
                  to="/hotel/view-bookings"
                >
                  <i className="bi bi-calendar-check"></i> View Bookings
                </Link>
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
                        <Link className="dropdown-item" to="/profile1">
                          <i className="bi bi-person"></i> Profile
                        </Link>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right"></i> Logout
                        </a>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link className="dropdown-item" to="/hotelogin">
                        <i className="bi bi-box-arrow-in-right"></i> Login
                      </Link>
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