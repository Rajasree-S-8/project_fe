// src/components/Customer/Customer.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Customer.css';
import Modal from 'react-bootstrap/Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CustomerDetails = ({ isActive, refreshKey }) => {
  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (isActive) {
      fetchCustomerData();
    }
  }, [refreshKey, isActive]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomerList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomerList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleViewImage = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowImageModal(true);
  };

  const downloadCustomerPDF = async (customer) => {
    setIsLoading(true);
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Customer Details', 105, 20, { align: 'center' });
      
      if (customer.image) {
        try {
          const imageUrl = `http://localhost:8080/api/files/uploads/${customer.image}`;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          
          reader.onload = function() {
            const imgData = reader.result;
            doc.addImage(imgData, 'JPEG', 15, 30, 40, 40);
            doc.setFontSize(12);
            doc.text(`Username: ${customer.username}`, 70, 35);
            doc.text(`Full Name: ${customer.fullName}`, 70, 45);
            doc.text(`Email: ${customer.email}`, 70, 55);
            doc.text(`Phone: ${customer.phoneNumber || 'N/A'}`, 70, 65);
            doc.text(`Address: ${customer.address || 'N/A'}`, 70, 75);
            doc.save(`customer_${customer.username}_details.pdf`);
          };
          
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error loading image:', error);
          addCustomerDetailsWithoutImage(doc, customer);
        }
      } else {
        addCustomerDetailsWithoutImage(doc, customer);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomerDetailsWithoutImage = (doc, customer) => {
    doc.setFontSize(12);
    doc.text(`Username: ${customer.username}`, 20, 30);
    doc.text(`Full Name: ${customer.fullName}`, 20, 40);
    doc.text(`Email: ${customer.email}`, 20, 50);
    doc.text(`Phone: ${customer.phoneNumber || 'N/A'}`, 20, 60);
    doc.text(`Address: ${customer.address || 'N/A'}`, 20, 70);
    doc.save(`customer_${customer.username}_details.pdf`);
  };

  const downloadAllCustomersPDF = async () => {
    setIsLoading(true);
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('All Customers Report', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
      
      const tableData = filteredCustomerList.map(customer => [
        customer.userId,
        customer.username,
        customer.fullName,
        customer.email,
        customer.phoneNumber || 'N/A',
        customer.address || 'N/A'
      ]);
      
      doc.autoTable({
        startY: 40,
        head: [['ID', 'Username', 'Full Name', 'Email', 'Phone', 'Address']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });
      
      doc.save('all_customers_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div id="customer-details" className="customer-management-container">
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
        <div className="d-flex align-items-center">
          <span className="total-badge me-3">
            <i className="bi bi-people-fill me-1"></i>
            Total: {filteredCustomerList.length}
          </span>
          <button 
            onClick={downloadAllCustomersPDF} 
            className="btn btn-primary btn-sm"
            disabled={isLoading || filteredCustomerList.length === 0}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-1"></span>
            ) : (
              <i className="bi bi-file-earmark-pdf me-1"></i>
            )}
            Export All
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Address</th>
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
                    {customer.image ? (
                      <div className="customer-image-container">
                        <img 
                          src={`http://localhost:8080/api/files/uploads/${customer.image}`} 
                          alt="Customer" 
                          className="customer-thumbnail"
                        />
                        <button 
                          className="view-image-btn"
                          onClick={() => handleViewImage(`http://localhost:8080/api/files/uploads/${customer.image}`)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="no-image-placeholder">
                        <i className="bi bi-person-circle"></i>
                      </div>
                    )}
                  </td>
                  <td>{customer.username}</td>
                  <td>{customer.fullName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber || '-'}</td>
                  <td>{customer.address || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => downloadCustomerPDF(customer)}
                        className="btn pdf-btn"
                        title="Download PDF"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <i className="bi bi-file-earmark-pdf"></i>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.userId)}
                        className="btn delete-btn"
                        title="Delete Customer"
                        disabled={isLoading}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
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

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Customer Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img 
            src={currentImage} 
            alt="Customer Full Size" 
            className="img-fluid modal-image"
            style={{ maxHeight: '70vh' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowImageModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDetails;