import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const StaffDetails = ({ isActive, refreshKey }) => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    address: '',
    age: '',
    phonenumber: '',
    role: '',
    password: '********'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaffData();
  }, [refreshKey]);

 useEffect(() => {
  const filterStaff = (staff) => {
    return Object.values(staff).some(value => {
      if (!value) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const filtered = staffList.filter(filterStaff);
  setFilteredStaffList(filtered);
  setCurrentPage(1);
}, [searchTerm, staffList]);

  const fetchStaffData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/staff/all');
      if (!response.ok) {
        throw new Error('Failed to fetch staff data');
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.staffId - b.staffId);
      setStaffList(sortedData);
      setFilteredStaffList(sortedData);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password === '********') return true; // Masked password is valid
    // Minimum 8 characters, at least one letter and one number
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
    if (!editFormData.fullname.trim()) {
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
  const currentItems = filteredStaffList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaffList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (staff) => {
    setEditingStaff(staff.staffId);
    setEditFormData({
      username: staff.username,
      fullname: staff.fullname,
      email: staff.email,
      address: staff.address,
      age: staff.age,
      phonenumber: staff.phonenumber,
      role: staff.role,
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

  const handleUpdateStaff = async (staffId) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const dataToSend = {
        username: editFormData.username,
        fullname: editFormData.fullname,
        email: editFormData.email,
        address: editFormData.address,
        age: editFormData.age,
        phonenumber: editFormData.phonenumber,
        role: editFormData.role,
        // Only send password if it was changed (not the masked value)
        password: editFormData.password !== '********' ? editFormData.password : null
      };

      const response = await fetch(`http://localhost:8080/api/staff/update/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update staff');
      }

      alert('Staff updated successfully!');
      setEditingStaff(null);
      setShowPassword(false);
      fetchStaffData();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/staff/delete/${staffId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete staff');
      }

      alert('Staff deleted successfully!');
      fetchStaffData();
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
    <div id="staff-details" className={`mt-5 ${!isActive ? 'd-none' : ''}`}>
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-people-fill fs-1 me-3 text-primary"></i>
        <div>
          <h1 className="h3 fw-bold mb-1">Staff Details</h1>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle-fill me-2"></i>
            View and manage all staff information
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Staff Members</h5>
          <div className="d-flex align-items-center">
            <div className="input-group input-group-sm me-3" style={{ width: '250px' }}>
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search staff..."
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="badge bg-primary">
              <i className="bi bi-person-fill me-1"></i>
              Total: {filteredStaffList.length}
            </span>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading staff data...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Age</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Password</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((staff, index) => (
                        <tr key={staff.staffId}>
                          <td>{getDisplayId(index)}</td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <input
                                type="text"
                                name="username"
                                value={editFormData.username}
                                onChange={handleEditFormChange}
                                className="form-control form-control-sm"
                                required
                              />
                            ) : (
                              staff.username
                            )}
                          </td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <input
                                type="text"
                                name="fullname"
                                value={editFormData.fullname}
                                onChange={handleEditFormChange}
                                className="form-control form-control-sm"
                                required
                              />
                            ) : (
                              staff.fullname
                            )}
                          </td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <input
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleEditFormChange}
                                className="form-control form-control-sm"
                                required
                              />
                            ) : (
                              staff.email
                            )}
                          </td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <input
                                type="text"
                                name="address"
                                value={editFormData.address}
                                onChange={handleEditFormChange}
                                className="form-control form-control-sm"
                              />
                            ) : (
                              staff.address
                            )}
                          </td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <input
                                type="number"
                                name="age"
                                value={editFormData.age}
                                onChange={handleEditFormChange}
                                className="form-control form-control-sm"
                                min="18"
                                max="100"
                              />
                            ) : (
                              staff.age
                            )}
                          </td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <input
                                type="tel"
                                name="phonenumber"
                                value={editFormData.phonenumber}
                                onChange={handleEditFormChange}
                                className="form-control form-control-sm"
                              />
                            ) : (
                              staff.phonenumber
                            )}
                          </td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <select
                                name="role"
                                value={editFormData.role}
                                onChange={handleEditFormChange}
                                className="form-select form-select-sm"
                              >
                                <option value="Hotel Manager">Hotel Manager</option>
                                <option value="Restaurant Manager">Restaurant Manager</option>
                                
                                <option value="Other">Other</option>
                              </select>
                            ) : (
                              staff.role
                            )}
                          </td>
                          <td>
                            {editingStaff === staff.staffId ? (
                              <div className="input-group input-group-sm">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  value={editFormData.password}
                                  onChange={handleEditFormChange}
                                  className="form-control"
                                  placeholder="Leave blank to keep current"
                                />
                                <button
                                  className="btn btn-outline-secondary"
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
                            {editingStaff === staff.staffId ? (
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  onClick={() => handleUpdateStaff(staff.staffId)}
                                  className="btn btn-success btn-sm"
                                  title="Save"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  ) : (
                                    <i className="bi bi-check-lg"></i>
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingStaff(null);
                                    setShowPassword(false);
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  title="Cancel"
                                  disabled={isLoading}
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  onClick={() => handleEditClick(staff)}
                                  className="btn btn-primary btn-sm"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteStaff(staff.staffId)}
                                  className="btn btn-danger btn-sm"
                                  title="Delete"
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
                        <td colSpan="10" className="text-center py-4">
                          No staff members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredStaffList.length > itemsPerPage && (
                <nav className="mt-3">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                          {number}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
        <div className="card-footer bg-white">
          <small className="text-muted">
            <i className="bi bi-clock-history me-1"></i>
            Last updated: {new Date().toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;