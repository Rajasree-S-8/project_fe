import React from 'react';
import './admin.css';

const TableSection = ({ id, title, subtitle, icon, columns }) => (
  <div id={id} className="mt-5 d-none">
    <h1 className="h3 fw-bold mb-1">{title}</h1>
    <p className="text-muted mb-4">{subtitle}</p>
    <div className="card shadow-sm">
      <div className="card-header bg-light d-flex align-items-center">
        <i className={`fas ${icon} me-2`} />
        <span className="fw-semibold">{title} Data</span>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
            <label htmlFor={`${id}-entries`} className="form-label me-2 text-muted">
              Entries per page
            </label>
            <select id={`${id}-entries`} className="form-select form-select-sm w-auto">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <input type="search" className="form-control form-control-sm" placeholder="Search..." />
          </div>
        </div>
        <div className="table-container table-responsive">
          <table className="dataTable table table-bordered" id={`${id}-table`}>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} scope="col" className="sorting" tabIndex={0}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const Admin = () => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hotel Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
    <link href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" rel="stylesheet" />

    <div className="d-flex">
      <aside className="sidebar d-flex flex-column justify-content-between">
        <div>
          <div className="top-section border-bottom border-dark p-3">
            <i className="fas fa-user fa-lg text-white" />
            <a href="/logout" className="btn btn-outline-light btn-sm">Logout</a>
          </div>
          <nav className="mt-4 px-4">
            <div className="mb-4">
              <p className="text-uppercase text-xs fw-bold text-muted mb-2">Core</p>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active" href="#dashboard"><i className="fas fa-tachometer-alt" /> Dashboard</a>
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <p className="text-uppercase text-xs fw-bold text-muted mb-2">Staff</p>
              <ul className="nav flex-column">
                {[
                  { href: '#add-staff', icon: 'fa-user-plus', text: 'Add Staff' },
                  { href: '#staff-details', icon: 'fa-list', text: 'Staff Details' },
                  { href: '#hotel-manager', icon: 'fa-user-tie', text: 'Hotel Manager' },
                  { href: '#restaurant-manager', icon: 'fa-utensils', text: 'Restaurant Manager' },
                ].map(({ href, icon, text }) => (
                  <li key={href} className="nav-item">
                    <a className="nav-link" href={href}><i className={`fas ${icon}`} /> {text}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-uppercase text-xs fw-bold text-muted mb-2">Items</p>
              <ul className="nav flex-column">
                {[
                  { href: '#foods', icon: 'fa-utensils', text: 'Food Items' },
                  { href: '#rooms', icon: 'fa-bed', text: 'Rooms' },
                  { href: '#ratings-reviews', icon: 'fa-star', text: 'Ratings & Reviews' },
                ].map(({ href, icon, text }) => (
                  <li key={href} className="nav-item">
                    <a className="nav-link" href={href}><i className={`fas ${icon}`} /> {text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <div className="p-3 border-top border-dark text-muted">
          <p>Logged in as: <span className="text-white">Hotel Admin</span></p>
        </div>
      </aside>
      <main className="flex-grow-1 p-4">
        <div id="dashboard">
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
        <div id="add-staff" className="mt-5 d-none">
          <h1 className="h3 fw-bold mb-1">Add Staff</h1>
          <p className="text-muted mb-4">Add a new staff member</p>
          <div className="card shadow-sm">
            <div className="card-body">
              <form id="add-staff-form">
                <div className="row">
                  {[
                    { id: 'staffId', label: 'Staff ID', type: 'text' },
                    { id: 'username', label: 'Username', type: 'text' },
                    { id: 'firstName', label: 'First Name', type: 'text' },
                    { id: 'lastName', label: 'Last Name', type: 'text' },
                    { id: 'email', label: 'Email', type: 'email' },
                    { id: 'address', label: 'Address', type: 'text' },
                    { id: 'phoneNumber', label: 'Phone Number', type: 'tel' },
                    { id: 'password', label: 'Password', type: 'password' },
                  ].map(({ id, label, type }) => (
                    <div key={id} className="col-12 col-md-6 mb-3">
                      <label htmlFor={id} className="form-label">{label}</label>
                      <input type={type} className="form-control" id={id} name={id} required />
                    </div>
                  ))}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-select" id="role" name="role" required>
                      <option value="" disabled selected>Select a role</option>
                      <option value="Hotel Manager">Hotel Manager</option>
                      <option value="Restaurant Manager">Restaurant Manager</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="file" className="form-control" id="image" name="image" accept="image/*" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Add Staff</button>
              </form>
            </div>
          </div>
        </div>
        <TableSection
          id="staff-details"
          title="Staff Details"
          subtitle="View staff information"
          icon="fa-table"
          columns={['Staff ID', 'Username', 'First Name', 'Last Name', 'Email', 'Address', 'Phone Number', 'Role', 'Image']}
        />
        <TableSection
          id="foods"
          title="Food Orders"
          subtitle="View food order details"
          icon="fa-utensils"
          columns={['Food Name', 'Price', 'Quantity', 'Payment Status']}
        />
        <TableSection
          id="rooms"
          title="Rooms"
          subtitle="View room assignment details"
          icon="fa-bed"
          columns={['Room Number', 'Customer Name', 'Check-in Date', 'Check-out Date', 'Price']}
        />
        <TableSection
          id="ratings-reviews"
          title="Ratings & Reviews"
          subtitle="View customer ratings and reviews"
          icon="fa-star"
          columns={['Customer Name', 'Rating', 'Description']}
        />
        {['hotel-manager', 'restaurant-manager'].map(id => (
          <div key={id} id={id} className="mt-5 d-none">
            <h1 className="h3 fw-bold mb-1">{id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
            <p className="text-muted mb-4">Manage {id.split('-').join(' ')}s</p>
            <div className="card shadow-sm">
              <div className="card-body">
                <p>{id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} content will be populated here.</p>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  </>
);

export default Admin;