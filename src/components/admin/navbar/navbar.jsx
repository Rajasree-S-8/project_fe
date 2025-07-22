import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ activeSection, handleNavClick }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const Logout = () => {
    localStorage.removeItem('activeSection');
    localStorage.removeItem('customer');
    navigate('/');
  };

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const navSections = [
    {
      title: 'Core',
      items: [
        { href: '#dashboard', icon: 'fa-tachometer-alt', text: 'Dashboard', section: 'dashboard', color: '#2ecc71' },
      ],
    },
    {
      title: 'Customers',
      items: [
        { href: '#customers', icon: 'fa-users', text: 'All Customers', section: 'customers', color: '#3498db' },
        { href: '#customer-Booking', icon: 'fa-calendar-check', text: 'Room Booking', section: 'customer-registrations', color: '#2ecc71' },
        { href: '#customer-food-orders', icon: 'fa-utensils', text: 'Food Orders', section: 'customer-food-orders', color: '#e67e22' },
      ],
    },
    {
      title: 'Staff Management',
      items: [
        { href: '#add-staff', icon: 'fa-user-plus', text: 'Add Staff', section: 'add-staff', color: '#3498db' },
        { href: '#staff-details', icon: 'fa-users-cog', text: 'Staff Details', section: 'staff-details', color: '#9b59b6' },
        { href: '#hotel-manager', icon: 'fa-user-tie', text: 'Hotel Manager', section: 'hotel-manager', color: '#f39c12' },
        { href: '#restaurant-manager', icon: 'fa-utensils', text: 'Restaurant Manager', section: 'restaurant-manager', color: '#1abc9c' },
      ],
    },
    {
      title: 'Inventory',
      items: [
        { href: '#foods', icon: 'fa-utensils', text: 'Food Items', section: 'foods', color: '#e74c3c' },
        { href: '#rooms', icon: 'fa-bed', text: 'Rooms', section: 'rooms', color: '#3498db' },
      ],
    },
    {
      title: 'Feedback',
      items: [
        { href: '#ratings-reviews', icon: 'fa-star', text: 'Ratings & Reviews', section: 'ratings-reviews', color: '#f1c40f' },
        { href: '#reports', icon: 'fa-chart-bar', text: 'Reports', section: 'reports', color: '#2c3e50' },
      ],
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <i className="fas fa-user-shield me-2" style={{ color: '#3498db' }} />
          Admin Panel
        </div>
        <button className="navbar-toggle" onClick={toggleMenu}>
          <i className="fas fa-bars" />
        </button>
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          {navSections.map(({ title, items }) => (
            <div key={title} className="nav-section">
              <div
                className="nav-section-title"
                onClick={() => toggleDropdown(title)}
              >
                {title}
                <i className={`fas fa-chevron-${openDropdown === title ? 'up' : 'down'}`} />
              </div>
              <ul className={`nav-list ${openDropdown === title ? 'open' : ''}`}>
                {items.map(({ href, icon, text, section, color }) => (
                  <li key={href} className="nav-item">
                    <a
                      className={`nav-link ${activeSection === section ? 'active' : ''}`}
                      href={href}
                      onClick={(e) => {
                        handleNavClick(e, section);
                        setIsMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      <i className={`fas ${icon}`} style={{ color }} /> {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={Logout} className="logout-btn">
            <i className="bi bi-box-arrow-left" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;