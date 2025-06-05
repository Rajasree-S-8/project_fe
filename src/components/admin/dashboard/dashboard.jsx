  import React from 'react';

  const Dashboard = ({ isActive }) => (
    <div id="dashboard" className={!isActive ? 'd-none' : ''}>
      <h1 className="h3 fw-bold mb-1">Dashboard</h1>
      <p className="text-muted mb-4">Dashboard</p>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-4 mb-4">
        {[
          { title: 'Total Users', id: 'total-users', value: '0', bg: 'bg-primary' },
          { title: 'Total Hotel Manager', id: 'total-hotel-managers', value: '0', bg: 'bg-warning' },
          { title: 'Total Restaurant Manager', id: 'total-restaurant-managers', value: '0', bg: 'bg-success' },
          { title: 'Total Rating', id: 'total-rating', value: '0/5', bg: 'bg-danger' },
          { title: 'Total Reviews', id: 'total-reviews', value: '0', bg: 'bg-info' },
        ].map(({ title, id, value, bg }) => (
          <div key={id} className="col">
            <div className={`card shadow-sm text-white ${bg}`}>
              <div className="card-body">
                <div className="card-title">{title}</div>
                <div className="fs-4 fw-bold" id={id}>{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  export default Dashboard;