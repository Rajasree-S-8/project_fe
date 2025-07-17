import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header1/header1.jsx';
import './hotelhome.css';

function HotelHome() {
  const navigate = useNavigate();

  // Data for stats cards
  const stats = [
    { icon: '🏨', value: '120+', label: 'Rooms Available' },
    { icon: '🌟', value: '4.9', label: 'Average Rating' },
    { icon: '👥', value: '5K+', label: 'Happy Guests' }
  ];

  // Data for feature cards
  const features = [
    { 
      icon: '➕', 
      title: 'Add Rooms', 
      description: 'Easily add new rooms to your inventory with all necessary details.',
      path: '/hotel/addroom'
    },
    { 
      icon: '🛏️', 
      title: 'View Rooms', 
      description: 'Manage and view all room details, availability, and status.',
      path: '/hotel/viewrooms'
    },
    { 
      icon: '👤', 
      title: 'Customer Management', 
      description: 'Track customer information and preferences.',
      path: '/hotel/viewcustomers'
    },
    { 
      icon: '📅', 
      title: 'Booking System', 
      description: 'Manage current and upcoming reservations efficiently.',
      path: '/hotel/view-bookings'
    }
  ];

  // Data for quick actions
  const quickActions = [
    { 
      text: 'Add New Room', 
      className: 'action-btn primary',
      path: '/hotel/addroom'
    },
    { 
      text: 'Check Bookings', 
      className: 'action-btn secondary',
      path: '/hotel/view-bookings'
    },
    { 
      text: 'View Customers', 
      className: 'action-btn accent',
      path: '/hotel/viewcustomers'
    }
  ];

  return (
    <div className="app-container">
      <Header />
      <div className="home-content">
        {/* Hero Section */}
        <section className="hotel-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Welcome to <span>Revzz Hotel</span></h1>
            <p className="hero-subtitle">Elevating hospitality through seamless management</p>
            
            <div className="stats-container">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Management Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card" 
                onClick={() => navigate(feature.path)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && navigate(feature.path)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-buttons">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                onClick={() => navigate(action.path)} 
                className={action.className}
              >
                {action.text}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HotelHome;