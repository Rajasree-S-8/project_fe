import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Customer.css';

const CustomerDetails = ({ isActive, refreshKey }) => {
  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '********'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomerData();
  }, [refreshKey]);

  useEffect(() => {
    const filterCustomer = (customer) => {
      return Object.values(customer).some(value => {
        if (!value) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    };

    const filtered = customerList.filter(filterCustomer);
    setFilteredCustomerList(filtered);
    setCurrentPage(1);
  }, [searchTerm, customerList]);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/customers/all');
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.userId - b.userId);
      setCustomerList(sortedData);
      setFilteredCustomerList(sortedData);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password === '********') return true;
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!editFormData.username.trim()) {
      alert('Username is required');
      return false;
    }
    if (!editFormData.fullName.trim()) {
      alert('Full name is required');
      return false;
    }
    if (!validateEmail(editFormData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!validatePassword(editFormData.password)) {
      alert('Password must be at least 8 characters long and contain at least one letter and one number');
      return false;
    }
    return true;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomerList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomerList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (customer) => {
    setEditingCustomer(customer.userId);
    setEditFormData({
      username: customer.username,
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      password: '********'
    });
    setShowPassword(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateCustomer = async (userId) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const dataToSend = {
        username: editFormData.username,
        fullName: editFormData.fullName,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        address: editFormData.address,
        password: editFormData.password !== '********' ? editFormData.password : null
      };

      const response = await fetch(`http://localhost:8080/api/customers/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update customer');
      }

      alert('Customer updated successfully!');
      setEditingCustomer(null);
      setShowPassword(false);
      fetchCustomerData();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/customers/delete/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete customer');
      }

      alert('Customer deleted successfully!');
      fetchCustomerData();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayId = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  return (
    <div id="customer-details" className={`customer-management-container ${!isActive ? 'd-none' : ''}`}>
      <div className="customer-header">
        <h1 className="customer-title">Customer Management</h1>
        <p className="customer-subtitle">Manage all customer information with ease</p>
      </div>

      {error && (
        <div className="alert alert-danger fade-in" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="customer-controls">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="total-badge">
          <i className="bi bi-people-fill me-1"></i>
          Total: {filteredCustomerList.length}
        </span>
      </div>

      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="loading-cell">
                  <div className="spinner"></div>
                  <span>Loading customer data...</span>
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((customer, index) => (
                <tr key={customer.userId} className="customer-row">
                  <td>{getDisplayId(index)}</td>
                  <td>
                    {editingCustomer === customer.userId ? (
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditFormChange}
                        className="form-control edit-input"
                        required
                      />
                    ) : (
                      customer.username
                    )}
                  </td>
                  <td>
                    {editingCustomer === customer.userId ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editFormData.fullName}
                        onChange={handleEditFormChange}
                        className="form-control edit-input"
                        required
                      />
                    ) : (
                      customer.fullName
                    )}
                  </td>
                  <td>
                    {editingCustomer === customer.userId ? (
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        className="form-control edit-input"
                        required
                      />
                    ) : (
                      customer.email
                    )}
                  </td>
                  <td>
                    {editingCustomer === customer.userId ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editFormData.phoneNumber}
                        onChange={handleEditFormChange}
                        className="form-control edit-input"
                      />
                    ) : (
                      customer.phoneNumber || '-'
                    )}
                  </td>
                  <td>
                    {editingCustomer === customer.userId ? (
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditFormChange}
                        className="form-control edit-input"
                      />
                    ) : (
                      customer.address || '-'
                    )}
                  </td>
                  <td>
                    {editingCustomer === customer.userId ? (
                      <div className="password-input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={editFormData.password}
                          onChange={handleEditFormChange}
                          className="form-control password-input"
                          placeholder="Leave blank to keep current"
                        />
                        <button
                          className="toggle-password"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    ) : (
                      "********"
                    )}
                  </td>
                  <td>
                    {editingCustomer === customer.userId ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleUpdateCustomer(customer.userId)}
                          className="btn save-btn"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <i className="bi bi-check-lg"></i>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCustomer(null);
                            setShowPassword(false);
                          }}
                          className="btn cancel-btn"
                          disabled={isLoading}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                       
                        <button
                          onClick={() => handleDeleteCustomer(customer.userId)}
                          className="btn delete-btn"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <i className="bi bi-exclamation-circle"></i>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredCustomerList.length > itemsPerPage && (
        <div className="pagination-container">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link prev-next" 
                  onClick={() => paginate(currentPage - 1)}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button 
                    onClick={() => paginate(number)} 
                    className="page-link page-number"
                  >
                    {number}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link prev-next" 
                  onClick={() => paginate(currentPage + 1)}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <div className="last-updated">
        <i className="bi bi-clock-history"></i>
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default CustomerDetails;