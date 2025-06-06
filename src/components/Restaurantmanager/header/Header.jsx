import React from "react";
import { NavLink } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#" onClick={() => navigate('/home')}>
          <span className="text-warning">Revzz</span> Hotel
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" onClick={() => navigate('/home')}>
                <i className="fas fa-home me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" onClick={() => navigate("/addfood")}>
                <i className="fas fa-plus-circle me-1"></i> Add Food
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" onClick={() => navigate("/viewfood")}>
                <i className="fas fa-utensils me-1"></i> View Menu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" onClick={() => navigate("/vieworders")}>
                <i className="fas fa-clipboard-list me-1"></i> Orders
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink 
                className="nav-link dropdown-toggle" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="fas fa-user-circle me-1"></i> Profile
              </NavLink>
              <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                <li><NavLink className="dropdown-item" onClick={() => navigate("/profile")}>
                  <i className="fas fa-user me-2"></i> My Profile
                </NavLink></li>
                <li><hr className="dropdown-divider" /></li>
                <li><NavLink className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i> Logout
                </NavLink></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;