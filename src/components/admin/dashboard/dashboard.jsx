import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ isActive }) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalHotelManagers: 0,
    totalRestaurantManagers: 0,
    totalRating: '0/5',
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [customersRes, staffRes, reviewsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/customers/all'),
        axios.get('http://localhost:8080/api/staff/all'),
        // Assuming you have an API for reviews stats
        axios.get('http://localhost:8080/api/reviews/stats').catch(() => ({
          data: { averageRating: '0/5', totalReviews: 0 },
        })),
      ]);

      const customersData = Array.isArray(customersRes.data) ? customersRes.data : [];
      const staffData = Array.isArray(staffRes.data) ? staffRes.data : [];

      const totalCustomers = customersData.length;
      const totalHotelManagers = staffData.filter(
        (staff) => staff.role === 'Hotel Manager'
      ).length;
      const totalRestaurantManagers = staffData.filter(
        (staff) => staff.role === 'Restaurant Manager'
      ).length;
      const { averageRating, totalReviews } = reviewsRes.data;

      setStats({
        totalCustomers,
        totalHotelManagers,
        totalRestaurantManagers,
        totalRating: averageRating || '0/5',
        totalReviews: totalReviews || 0,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      if (retryCount < 3) {
        setTimeout(() => setRetryCount(retryCount + 1), 2000); // Retry after 2 seconds
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchStats();
    }
  }, [isActive, retryCount]);

  if (!isActive) return null;

  if (loading) {
    return (
      <div id="dashboard">
        <h1 className="h3 fw-bold mb-1">Dashboard</h1>
        <p className="text-muted mb-4">Loading statistics...</p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="dashboard">
        <h1 className="h3 fw-bold mb-1">Dashboard</h1>
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <button className="btn btn-primary" onClick={fetchStats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div id="dashboard">
      <h1 className="h3 fw-bold mb-1">Dashboard</h1>
      <p className="text-muted mb-4">Overview of your hotel management system</p>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-4 mb-4">
        {[
          {
            title: 'Total Customers',
            id: 'total-customers',
            value: stats.totalCustomers,
            bg: 'bg-primary',
            icon: 'bi-people-fill',
          },
          {
            title: 'Hotel Managers',
            id: 'total-hotel-managers',
            value: stats.totalHotelManagers,
            bg: 'bg-warning',
            icon: 'bi-person-badge-fill',
          },
          {
            title: 'Restaurant Managers',
            id: 'total-restaurant-managers',
            value: stats.totalRestaurantManagers,
            bg: 'bg-success',
            icon: 'bi-egg-fried',
          },
          {
            title: 'Average Rating',
            id: 'total-rating',
            value: stats.totalRating,
            bg: 'bg-danger',
            icon: 'bi-star-fill',
          },
          {
            title: 'Total Reviews',
            id: 'total-reviews',
            value: stats.totalReviews,
            bg: 'bg-info',
            icon: 'bi-chat-left-text-fill',
          },
        ].map(({ title, id, value, bg, icon }) => (
          <div key={id} className="col">
            <div className={`card shadow-sm text-white ${bg}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="card-title fs-6">{title}</div>
                    <div className="fs-4 fw-bold" id={id}>
                      {value}
                    </div>
                  </div>
                  <i className={`bi ${icon} fs-2 opacity-50`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;