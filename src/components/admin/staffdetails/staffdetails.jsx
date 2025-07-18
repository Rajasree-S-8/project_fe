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
    setImagePreview(staff.image ? `http://localhost:8080/api/files/uploads/${staff.image}` : null);
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
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
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
      formData.append('staff', JSON.stringify({
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

  const downloadIndividualPDF = (staff) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm'
    });

    // Add header with logo and hotel name
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text('Revuzz Hotel', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Kollam, Kerala, 691572, Thiruvanathapuram', 105, 20, { align: 'center' });
    doc.text('Phone: +91 9876543210 | Email: revuzz@hotel.com', 105, 25, { align: 'center' });

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text(`Staff Profile: ${staff.fullname}`, 105, 35, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 42, { align: 'center' });

    // Add staff image if available
    if (staff.image) {
      try {
        const img = new Image();
        img.src = `http://localhost:8080/api/files/uploads/${staff.image}`;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const imgWidth = 40;
          const imgHeight = 40;
          const pageWidth = doc.internal.pageSize.getWidth();
          const x = (pageWidth - imgWidth) / 2;
          
          doc.addImage(img, 'JPEG', x, 50, imgWidth, imgHeight);
          addStaffDetails(doc, staff, 95);
          doc.save(`staff_profile_${staff.staffId}_${new Date().toISOString().slice(0, 10)}.pdf`);
        };
        img.onerror = () => {
          addStaffDetails(doc, staff, 50);
          doc.save(`staff_profile_${staff.staffId}_${new Date().toISOString().slice(0, 10)}.pdf`);
        };
      } catch (error) {
        console.error('Error loading image:', error);
        addStaffDetails(doc, staff, 50);
        doc.save(`staff_profile_${staff.staffId}_${new Date().toISOString().slice(0, 10)}.pdf`);
      }
    } else {
      addStaffDetails(doc, staff, 50);
      doc.save(`staff_profile_${staff.staffId}_${new Date().toISOString().slice(0, 10)}.pdf`);
    }
  };

  const addStaffDetails = (doc, staff, startY) => {
    const tableColumn = ["Field", "Details"];
    const tableRows = [
      ["ID", staff.staffId],
      ["Username", staff.username],
      ["Full Name", staff.fullname],
      ["Email", staff.email],
      ["Age", staff.age],
      ["Phone", staff.phonenumber],
      ["Role", staff.role],
      ["Join Date", new Date(staff.createdAt).toLocaleDateString()]
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: startY,
      styles: {
        fontSize: 10,
        cellPadding: 3,
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
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      }
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for choosing our hotel management system!', 105, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    doc.text('For any inquiries, please contact us at revuzz@hotel.com', 105, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 190, 280, { align: 'right' });
    }
  };

  const downloadTotalPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });

    // Add header with logo and hotel name
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text('Revuzz Hotel', 148, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Kollam, Kerala, 691572, Thiruvanathapuram', 148, 20, { align: 'center' });
    doc.text('Phone: +91 9876543210 | Email: revuzz@hotel.com', 148, 25, { align: 'center' });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text('Staff Management Report', 148, 35, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 148, 42, { align: 'center' });
    doc.text(`Total Staff Members: ${staffList.length}`, 148, 48, { align: 'center' });

    const tableColumn = ["ID", "Username", "Full Name", "Email", "Age", "Phone", "Role", "Join Date"];
    const tableRows = staffList.map(staff => [
      staff.staffId,
      staff.username,
      staff.fullname,
      staff.email,
      staff.age,
      staff.phonenumber,
      staff.role,
      new Date(staff.createdAt).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
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
        6: { cellWidth: 30 },
        7: { cellWidth: 25 }
      }
    });

    // Add summary statistics
    const roleCounts = staffList.reduce((acc, staff) => {
      acc[staff.role] = (acc[staff.role] || 0) + 1;
      return acc;
    }, {});

    let summaryY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(40, 53, 147);
    doc.text('Staff Summary', 20, summaryY);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    summaryY += 7;
    
    Object.entries(roleCounts).forEach(([role, count], index) => {
      doc.text(`${role}: ${count} members`, 20, summaryY + (index * 5));
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for choosing our hotel management system!', 148, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    doc.text('For any inquiries, please contact us at revuzz@hotel.com', 148, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 280, 200, { align: 'right' });
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
        <div className="control-buttons">
          <button 
            onClick={downloadTotalPDF}
            className="pdf-btn"
            disabled={isLoading || staffList.length === 0}
          >
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Download All PDF
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
                    {editingStaff === staff.staffId ? (
                      <div className="image-upload-wrapper">
                        <div className="image-preview-container">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                          ) : (
                            <div className="image-placeholder">
                              <i className="bi bi-person-square"></i>
                              <span>No image selected</span>
                            </div>
                          )}
                        </div>
                        <div className="image-upload-controls">
                          <label className="image-upload-button">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="image-upload-input"
                            />
                            <span className="upload-text">
                              <i className="bi bi-upload me-1"></i>
                              {imagePreview ? 'Change Image' : 'Upload Image'}
                            </span>
                          </label>
                          {imagePreview && (
                            <button 
                              className="remove-image-button"
                              onClick={() => {
                                setImagePreview(null);
                                setImageFile(null);
                              }}
                            >
                              <i className="bi bi-trash"></i> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      staff.image ? (
                        <img 
                          src={`http://localhost:8080/api/files/uploads/${staff.image}`} 
                          alt="Staff" 
                          className="staff-image"
                        />
                      ) : (
                        <div className="image-placeholder">
                          <i className="bi bi-person-square"></i>
                        </div>
                      )
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
                        <button
                          onClick={() => downloadIndividualPDF(staff)}
                          className="btn pdf-btn"
                          disabled={isLoading}
                        >
                          <i className="bi bi-file-earmark-pdf"></i>
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
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
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

export default StaffDetails;