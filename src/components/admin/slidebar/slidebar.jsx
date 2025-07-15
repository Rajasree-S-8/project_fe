import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './slidebar.css';

const Sidebar = ({ activeSection, handleNavClick }) => {
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.removeItem('activeSection');
        navigate('/admin');
    };

    useEffect(() => {
        // Save active section to localStorage when it changes
        localStorage.setItem('activeSection', activeSection);
    }, [activeSection]);

    return (
        <aside className="sidebar">
            <div>
                <div className="top-section border-bottom border-dark p-3 d-flex justify-content-between align-items-center">
                    <span className="text-white fw-bold">
                        <i className="fas fa-user-shield me-2" style={{ color: '#3498db' }} /> Admin
                    </span>
                    <button onClick={Logout} className="btn btn-sm" style={{ backgroundColor: '#e74c3c', color: 'white' }}>
                        <i className="bi bi-box-arrow-left" /> Logout
                    </button>
                </div>
                <nav className="mt-4 px-4">
                    <div className="mb-4">
                        <p className="text-uppercase text-xs fw-bold mb-2">Core</p>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a className={`nav-link ${activeSection === 'dashboard' && 'active'}`} 
                                   href="#dashboard" 
                                   onClick={(e) => handleNavClick(e, 'dashboard')}>
                                    <i className="fas fa-tachometer-alt" style={{ color: '#2ecc71' }} /> Dashboard
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* New Customer Section */}
                    <div className="mb-4">
                        <p className="text-uppercase text-xs fw-bold mb-2">Customers</p>
                        <ul className="nav flex-column">
                            {[
                                { href: '#customers', icon: 'fa-users', text: 'All Customers', section: 'customers', color: '#3498db' },
                                { href: '#customer-Booking', icon: 'fa-user-plus', text: 'Room Booking', section: 'customer-registrations', color: '#2ecc71' },
                            ].map(({ href, icon, text, section, color }) => (
                                <li key={href} className="nav-item">
                                    <a className={`nav-link ${activeSection === section && 'active'}`} 
                                       href={href} 
                                       onClick={(e) => handleNavClick(e, section)}>
                                        <i className={`fas ${icon}`} style={{ color }} /> {text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <p className="text-uppercase text-xs fw-bold mb-2">Staff</p>
                        <ul className="nav flex-column">
                            {[
                                { href: '#add-staff', icon: 'fa-user-plus', text: 'Add Staff', section: 'add-staff', color: '#3498db' },
                                { href: '#staff-details', icon: 'fa-list', text: 'Staff Details', section: 'staff-details', color: '#9b59b6' },
                                { href: '#hotel-manager', icon: 'fa-user-tie', text: 'Hotel Manager', section: 'hotel-manager', color: '#f39c12' },
                                { href: '#restaurant-manager', icon: 'fa-utensils', text: 'Restaurant Manager', section: 'restaurant-manager', color: '#1abc9c' },
                            ].map(({ href, icon, text, section, color }) => (
                                <li key={href} className="nav-item">
                                    <a className={`nav-link ${activeSection === section && 'active'}`} 
                                       href={href} 
                                       onClick={(e) => handleNavClick(e, section)}>
                                        <i className={`fas ${icon}`} style={{ color }} /> {text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-uppercase text-xs fw-bold mb-2">Items</p>
                        <ul className="nav flex-column">
                            {[
                                { href: '#foods', icon: 'fa-utensils', text: 'Food Items', section: 'foods', color: '#e74c3c' },
                                { href: '#rooms', icon: 'fa-bed', text: 'Rooms', section: 'rooms', color: '#3498db' },
                                { href: '#ratings-reviews', icon: 'fa-star', text: 'Ratings & Reviews', section: 'ratings-reviews', color: '#f1c40f' },
                            ].map(({ href, icon, text, section, color }) => (
                                <li key={href} className="nav-item">
                                    <a className={`nav-link ${activeSection === section && 'active'}`} 
                                       href={href} 
                                       onClick={(e) => handleNavClick(e, section)}>
                                        <i className={`fas ${icon}`} style={{ color }} /> {text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;