// src/components/staffdetails/staffdetails.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './StaffDetails.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const StaffDetails = ({ isActive, refreshKey }) => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    age: '',
    phonenumber: '',
    role: '',
    password: '********'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isActive) {
      fetchStaffData();
    }
  }, [refreshKey, isActive]);

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
      age: staff.age,
      phonenumber: staff.phonenumber,
      role: staff.role,
      password: '********'
    });
    setImageFile(null);
    setImagePreview(null);
    setShowPassword(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStaff = async (staffId) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('staff', JSONRU.stringify({
        username: editFormData.username,
        fullname: editFormData.fullname,
        email: editFormData.email,
        age: editFormData.age,
        phonenumber: editFormData.phonenumber,
        role: editFormData.role,
        password: editFormData.password !== '********' ? editFormData.password : null
      }));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`http://localhost:8080/api/staff/update/${staffId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update staff');
      }

      alert('Staff updated successfully!');
      setEditingStaff(null);
      setImageFile(null);
      setImagePreview(null);
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

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });

    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text('Staff Management Report', 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });

    const tableColumn = ["ID", "Username", "Full Name", "Email", "Age", "Phone", "Role"];
    const tableRows = [];

    staffList.forEach(staff => {
      const staffData = [
        staff.staffId,
        staff.username,
        staff.fullname,
        staff.email,
        staff.age,
        staff.phonenumber,
        staff.role
      ];
      tableRows.push(staffData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [106, 17, 203],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 15 },
        5: { cellWidth: 25 },
        6: { cellWidth: 30 }
      }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 200, 200, { align: 'right' });
    }

    doc.save(`staff_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getDisplayId = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  if (!isActive) return null;

  return (
    <div id="staff-details" className="staff-management-container">
      <div className="staff-header">
        <h1 className="staff-title">Staff Management</h1>
        <p className="staff-subtitle">Manage all staff information with ease</p>
      </div>

      {error && (
        <div className="alert alert-danger fade-in" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="staff-controls">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <button 
            onClick={downloadPDF}
            className="pdf-btn"
          >
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Download PDF
          </button>
          <span className="total-badge">
            <i className="bi bi-people-fill me-1"></i>
            Total: {filteredStaffList.length}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="staff-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" className="loading-cell">
                  <div className="spinner"></div>
                  <span>Loading staff data...</span>
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((staff, index) => (
                <tr key={staff.staffId} className="staff-row">
                  <td>{getDisplayId(index)}</td>
                  <td>
                    {staff.image && (
                      <img 
                        src={`http://localhost:8080/api/files/uploads/${staff.image}`} 
                        alt="Staff" 
                        className="staff-image"
                      />
                    )}
                  </td>
                  <td>
                    {editingStaff === staff.staffId ? (
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditFormChange}
                        className="form-control edit-input"
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
                        className="form-control edit-input"
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
                        className="form-control edit-input"
                        required
                      />
                    ) : (
                      staff.email
                    )}
                  </td>
                  <td>
                    {editingStaff === staff.staffId ? (
                      <input
                        type="number"
                        name="age"
                        value={editFormData.age}
                        onChange={handleEditFormChange}
                        className="form-control edit-input"
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
                        className="form-control edit-input"
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
                        className="form-select edit-select"
                      >
                        <option value="Hotel Manager">Hotel Manager</option>
                        <option value="Restaurant Manager">Restaurant Manager</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span className={`role-badge ${
                        staff.role === 'Hotel Manager' ? 'hotel-manager' :
                        staff.role === 'Restaurant Manager' ? 'restaurant-manager' : 'other'
                      }`}>
                        {staff.role}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingStaff === staff.staffId ? (
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
                    {editingStaff === staff.staffId ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleUpdateStaff(staff.staffId)}
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
                            setEditingStaff(null);
                            setImageFile(null);
                            setImagePreview(null);
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
                          onClick={() => handleEditClick(staff)}
                          className="btn edit-btn"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.staffId)}
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
                <td colSpan="10" className="no-data">
                  <i className="bi bi-exclamation-circle"></i>
                  No staff members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredStaffList.length > itemsPerPage && (
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

      {editingStaff && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Edit Staff Member</h3>
            <div className="form-group">
              <label>Staff Image</label>
              <div className="image-upload-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <i className="bi bi-person-square"></i>
                    <span>No image selected</span>
                  </div>
                )}
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
                <label htmlFor="imageUpload" className="upload-btn">
                  <i className="bi bi-upload"></i> Choose Image
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => handleUpdateStaff(editingStaff)}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={() => {
                  setEditingStaff(null);
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDetails;