import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './StaffDetails.css';

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
    address: '',
    dateOfBirth: '',
    joiningDate: '',
    experience: '',
    qualification: '',
    password: '********',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

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
      const response = await fetch('http://localhost:8080/api/staff/all', {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch staff data');
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
      age: staff.age || '',
      phonenumber: staff.phonenumber,
      role: staff.role,
      address: staff.address || '',
      dateOfBirth: staff.dateOfBirth || '',
      joiningDate: staff.joiningDate || '',
      experience: staff.experience || '',
      qualification: staff.qualification || '',
      password: '********',
    });
    setImageFile(null);
    setImagePreview(staff.image ? `http://localhost:8080/api/files/uploads/${staff.image}` : null);
    setShowPassword(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
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
      setUploadProgress(0);
      setImageFile(file);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUploadProgress(100);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStaff = async (staffId) => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        'staff',
        JSON.stringify({
          username: editFormData.username,
          fullname: editFormData.fullname,
          email: editFormData.email,
          age: parseInt(editFormData.age) || null,
          phonenumber: editFormData.phonenumber,
          role: editFormData.role,
          address: editFormData.address,
          dateOfBirth: editFormData.dateOfBirth || null,
          joiningDate: editFormData.joiningDate || null,
          experience: parseInt(editFormData.experience) || null,
          qualification: editFormData.qualification,
          password: editFormData.password !== '********' ? editFormData.password : null,
        })
      );
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const response = await fetch(`http://localhost:8080/api/staff/update/${staffId}`, {
        method: 'PUT',
        body: formData,
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
      setUploadProgress(0);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/staff/delete/${staffId}`, {
        method: 'DELETE',
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

  const getImageAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, {
        mode: 'cors',
        headers: { 'Accept': 'image/*' },
      });
      if (!response.ok) {
        console.error(`Failed to fetch image from ${imageUrl}: ${response.statusText}`);
        return null;
      }
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  const generateStaffPDF = async (staffData, isIndividual = false) => {
    const doc = new jsPDF({
      orientation: isIndividual ? 'portrait' : 'landscape',
      unit: 'mm',
    });
    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text('Revuzz Hotel', isIndividual ? 105 : 148, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    doc.setFont('helvetica', 'normal');
    doc.text('Kollam, Kerala, 691572, Thiruvananthapuram', isIndividual ? 105 : 148, 20, { align: 'center' });
    doc.text('Phone: +91 9876543210 | Email: revuzz@hotel.com', isIndividual ? 105 : 148, 25, { align: 'center' });
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text(
      isIndividual ? `Staff Profile: ${staffData.fullname}` : 'Staff Management Report',
      isIndividual ? 105 : 148,
      35,
      { align: 'center' }
    );
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, isIndividual ? 105 : 148, 42, { align: 'center' });
    if (!isIndividual) {
      doc.text(`Total Staff Members: ${staffList.length}`, isIndividual ? 105 : 148, 48, { align: 'center' });
    }
    if (isIndividual) {
      let startY = 50;
      if (staffData.image) {
        const imageUrl = `http://localhost:8080/api/files/uploads/${staffData.image}`;
        const imageData = await getImageAsBase64(imageUrl);
        if (imageData) {
          try {
            doc.addImage(imageData, 'JPEG', 90, startY, 30, 30, undefined, 'FAST');
            startY += 35;
          } catch (error) {
            console.error('Error adding image to PDF:', error);
            doc.setFontSize(10);
            doc.setTextColor(108, 117, 125);
            doc.text('No Image Available', 105, startY + 15, { align: 'center' });
            startY += 20;
          }
        } else {
          doc.setFontSize(10);
          doc.setTextColor(108, 117, 125);
          doc.text('No Image Available', 105, startY + 15, { align: 'center' });
          startY += 20;
        }
      } else {
        doc.setFontSize(10);
        doc.setTextColor(108, 117, 125);
        doc.text('No Image Available', 105, startY + 15, { align: 'center' });
        startY += 20;
      }
      const tableColumn = ['Field', 'Details'];
      const tableRows = [
        ['ID', staffData.staffId],
        ['Username', staffData.username],
        ['Full Name', staffData.fullname],
        ['Email', staffData.email],
        ['Age', staffData.age || 'N/A'],
        ['Phone', staffData.phonenumber],
        ['Role', staffData.role],
        ['Address', staffData.address || 'N/A'],
        ['Date of Birth', staffData.dateOfBirth ? new Date(staffData.dateOfBirth).toLocaleDateString() : 'N/A'],
        ['Joining Date', staffData.joiningDate ? new Date(staffData.joiningDate).toLocaleDateString() : 'N/A'],
        ['Experience', staffData.experience ? `${staffData.experience} years` : 'N/A'],
        ['Qualification', staffData.qualification || 'N/A'],
      ];
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        styles: { fontSize: 10, cellPadding: 3, valign: 'middle' },
        headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
      });
    } else {
      const tableColumn = [
        'ID',
        'Image',
        'Username',
        'Full Name',
        'Email',
        'Age',
        'Phone',
        'Role',
        'Join Date',
      ];
      const tableRows = [];
      for (const staff of staffData) {
        let imageData = null;
        if (staff.image) {
          const imageUrl = `http://localhost:8080/api/files/uploads/${staff.image}`;
          imageData = await getImageAsBase64(imageUrl);
        }
        tableRows.push([
          staff.staffId,
          imageData ? { img: imageData, format: 'JPEG', width: 10, height: 10 } : 'No Image',
          staff.username,
          staff.fullname,
          staff.email,
          staff.age || 'N/A',
          staff.phonenumber,
          staff.role,
          staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : 'N/A',
        ]);
      }
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: { fontSize: 8, cellPadding: 2, valign: 'middle' },
        headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 15 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 40 },
          5: { cellWidth: 15 },
          6: { cellWidth: 25 },
          7: { cellWidth: 30 },
          8: { cellWidth: 25 },
        },
        didParseCell: (data) => {
          if (data.column.index === 1 && data.cell.raw && typeof data.cell.raw === 'object' && data.cell.raw.img) {
            data.cell.text = '';
            data.cell.contentWidth = data.cell.raw.width;
            data.cell.contentHeight = data.cell.raw.height;
          }
        },
        didDrawCell: (data) => {
          if (data.column.index === 1 && data.cell.raw && typeof data.cell.raw === 'object' && data.cell.raw.img) {
            try {
              doc.addImage(
                data.cell.raw.img,
                data.cell.raw.format,
                data.cell.x + 2,
                data.cell.y + 2,
                data.cell.raw.width,
                data.cell.raw.height
              );
            } catch (error) {
              console.error('Error drawing image in table:', error);
              data.cell.text = ['No Image'];
            }
          }
        },
      });
      const roleCounts = staffData.reduce((acc, staff) => {
        acc[staff.role] = (acc[staff.role] || 0) + 1;
        return acc;
      }, {});
      let summaryY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      doc.setFont('helvetica', 'bold');
      doc.text('Staff Summary', 20, summaryY);
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.setFont('helvetica', 'normal');
      summaryY += 7;
      Object.entries(roleCounts).forEach(([role, count], index) => {
        doc.text(`${role}: ${count} members`, 20, summaryY + index * 5);
      });
    }
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        isIndividual ? 190 : 280,
        isIndividual ? 280 : 200,
        { align: 'right' }
      );
    }
    doc.save(
      isIndividual
        ? `staff_profile_${staffData.staffId}_${new Date().toISOString().slice(0, 10)}.pdf`
        : `staff_report_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  const downloadIndividualPDF = async (staff) => {
    setIsLoading(true);
    try {
      await generateStaffPDF(staff, true);
    } catch (error) {
      console.error('Error generating individual PDF:', error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTotalPDF = async () => {
    setIsLoading(true);
    try {
      await generateStaffPDF(staffList, false);
    } catch (error) {
      console.error('Error generating all staff PDF:', error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setShowDetailsModal(true);
  };

  if (!isActive) return null;

  return (
    <div className="staff-management-container">
      <div className="staff-header">
        <h1 className="staff-title">Staff Management</h1>
        <p className="staff-subtitle">Manage and view all staff information</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i> {error}
        </div>
      )}

      <div className="staff-controls">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search staff by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="control-buttons">
          <button
            onClick={downloadTotalPDF}
            className="pdf-btn"
            disabled={isLoading || filteredStaffList.length === 0}
          >
            <i className="bi bi-file-earmark-pdf"></i> Download All Staff PDF
          </button>
          <span className="total-badge">
            <i className="bi bi-people-fill"></i> Total: {filteredStaffList.length}
          </span>
        </div>
      </div>

      <div className="staff-grid">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Loading staff data...</span>
          </div>
        ) : currentItems.length > 0 ? (
          currentItems.map((staff) => (
            <div key={staff.staffId} className="staff-card">
              <div className="card-header">
                {staff.image ? (
                  <img
                    src={`http://localhost:8080/api/files/uploads/${staff.image}`}
                    alt="Staff"
                    className="staff-image"
                    onError={(e) => {
                      console.error(`Failed to load image for staff ID ${staff.staffId}`);
                      e.target.src = '/placeholder.png';
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    <i className="bi bi-person-square"></i>
                  </div>
                )}
                <h3>{staff.fullname}</h3>
                <span className={`role-badge ${staff.role.toLowerCase().replace(' ', '-')}`}>
                  {staff.role}
                </span>
              </div>
              {editingStaff === staff.staffId ? (
                <div className="edit-form">
                  <div className="image-upload-wrapper">
                    <div className="image-preview-container">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="upload-progress">
                              <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          )}
                        </>
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
                          <i className="bi bi-upload"></i> {imagePreview ? 'Change Image' : 'Upload Image'}
                        </span>
                      </label>
                      {imagePreview && (
                        <button
                          className="remove-image-button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                            setUploadProgress(0);
                          }}
                        >
                          <i className="bi bi-trash"></i> Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Username"
                    required
                  />
                  <input
                    type="text"
                    name="fullname"
                    value={editFormData.fullname}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Full Name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Email"
                    required
                  />
                  <input
                    type="number"
                    name="age"
                    value={editFormData.age}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Age"
                    min="18"
                    max="100"
                  />
                  <input
                    type="tel"
                    name="phonenumber"
                    value={editFormData.phonenumber}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Phone Number"
                  />
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Address"
                  />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editFormData.dateOfBirth}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Date of Birth"
                  />
                  <input
                    type="date"
                    name="joiningDate"
                    value={editFormData.joiningDate}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Joining Date"
                  />
                  <input
                    type="number"
                    name="experience"
                    value={editFormData.experience}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Experience (years)"
                    min="0"
                  />
                  <input
                    type="text"
                    name="qualification"
                    value={editFormData.qualification}
                    onChange={handleEditFormChange}
                    className="edit-input"
                    placeholder="Qualification"
                  />
                  <select
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                    className="edit-select"
                  >
                    <option value="Hotel Manager">Hotel Manager</option>
                    <option value="Restaurant Manager">Restaurant Manager</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="password-input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditFormChange}
                      className="edit-input password-input"
                      placeholder="Leave blank to keep current"
                    />
                    <button
                      className="toggle-password"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleUpdateStaff(staff.staffId)}
                      className="save-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="spinner-border"></span>
                      ) : (
                        <i className="bi bi-check-lg"></i>
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingStaff(null);
                        setImageFile(null);
                        setImagePreview(null);
                        setShowPassword(false);
                      }}
                      className="cancel-btn"
                      disabled={isLoading}
                    >
                      <i className="bi bi-x-lg"></i> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-body">
                  <p><strong>Email:</strong> {staff.email}</p>
                  <p><strong>Age:</strong> {staff.age || 'N/A'}</p>
                  <p><strong>Phone:</strong> {staff.phonenumber}</p>
                  <div className="action-buttons">
                    <button onClick={() => handleViewDetails(staff)} className="view-btn">
                      <i className="bi bi-eye"></i> View
                    </button>
                    <button onClick={() => handleEditClick(staff)} className="edit-btn">
                      <i className="bi bi-pencil-square"></i> Edit
                    </button>
                    <button onClick={() => handleDeleteStaff(staff.staffId)} className="delete-btn">
                      <i className="bi bi-trash"></i> Delete
                    </button>
                    <button onClick={() => downloadIndividualPDF(staff)} className="pdf-btn" disabled={isLoading}>
                      <i className="bi bi-file-earmark-pdf"></i> PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data">
            <i className="bi bi-exclamation-circle"></i> No staff members found
          </div>
        )}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button onClick={() => paginate(number)} className="page-link">
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
        <i className="bi bi-clock-history"></i> Last updated: {new Date().toLocaleString()}
      </div>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Staff Details: {selectedStaff?.fullname}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStaff && (
            <div className="staff-details-modal">
              <div className="modal-image">
                {selectedStaff.image ? (
                  <img
                    src={`http://localhost:8080/api/files/uploads/${selectedStaff.image}`}
                    alt="Staff"
                    className="staff-image"
                  />
                ) : (
                  <div className="image-placeholder">
                    <i className="bi bi-person-square"></i>
                  </div>
                )}
              </div>
              <div className="modal-details">
                <p><strong>ID:</strong> {selectedStaff.staffId}</p>
                <p><strong>Username:</strong> {selectedStaff.username}</p>
                <p><strong>Full Name:</strong> {selectedStaff.fullname}</p>
                <p><strong>Email:</strong> {selectedStaff.email}</p>
                <p><strong>Age:</strong> {selectedStaff.age || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedStaff.phonenumber}</p>
                <p><strong>Role:</strong> {selectedStaff.role}</p>
                <p><strong>Address:</strong> {selectedStaff.address || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {selectedStaff.dateOfBirth ? new Date(selectedStaff.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Joining Date:</strong> {selectedStaff.joiningDate ? new Date(selectedStaff.joiningDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Experience:</strong> {selectedStaff.experience ? `${selectedStaff.experience} years` : 'N/A'}</p>
                <p><strong>Qualification:</strong> {selectedStaff.qualification || 'N/A'}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => downloadIndividualPDF(selectedStaff)} disabled={isLoading}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffDetails;