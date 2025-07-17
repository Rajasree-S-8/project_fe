import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header1/header1.jsx';
import './hotelhome.css';

function HotelHome() {
  const navigate = useNavigate();

  const stats = [
    { icon: '🏨', value: '120+', label: 'Rooms Available' },
    { icon: '🌟', value: '4.9', label: 'Average Rating' },
    { icon: '👥', value: '5K+', label: 'Happy Guests' }
  ];

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

  const quickActions = [
    { 
      text: 'Add New Room', 
      className: 'hotel-action-btn hotel-primary',
      path: '/hotel/addroom'
    },
    { 
      text: 'Check Bookings', 
      className: 'hotel-action-btn hotel-secondary',
      path: '/hotel/view-bookings'
    },
    { 
      text: 'View Customers', 
      className: 'hotel-action-btn hotel-accent',
      path: '/hotel/viewcustomers'
    }
  ];

  return (
    <div className="hotel-app-container">
      <Header />
      <div className="hotel-home-content mt-5">
        <section className="hotel-hero-section">
          <div className="hotel-hero-overlay"></div>
          <div className="hotel-hero-content">
            <h1 className="hotel-hero-title">
              Welcome to <span>Revzz Hotel</span>
            </h1>
            <p className="hotel-hero-subtitle">Elevating hospitality through seamless management</p>
            <div className="hotel-stats-container">
              {stats.map((stat, index) => (
                <div key={index} className="hotel-stat-card">
                  <div className="hotel-stat-icon">{stat.icon}</div>
                  <div className="hotel-stat-value">{stat.value}</div>
                  <div className="hotel-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hotel-features-section">
          <h2 className="hotel-section-title">Management Features</h2>
          <div className="hotel-features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="hotel-feature-card" 
                onClick={() => navigate(feature.path)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && navigate(feature.path)}
              >
                <div className="hotel-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="hotel-quick-actions">
          <h2 className="hotel-section-title">Quick Actions</h2>
          <div className="hotel-action-buttons">
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