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
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(17, 153, 142);
      doc.rect(0, 0, 210, 40, 'F');
      doc.text('Customer Profile', 105, 25, { align: 'center' });
      
      if (customer.image) {
        try {
          const imageUrl = `http://localhost:8080/api/files/uploads/${customer.image}`;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          
          reader.onload = function() {
            const imgData = reader.result;
            doc.addImage(imgData, 'JPEG', 20, 50, 50, 50, undefined, 'FAST');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(`Username: ${customer.username}`, 80, 55);
            doc.text(`Full Name: ${customer.fullName}`, 80, 65);
            doc.text(`Email: ${customer.email}`, 80, 75);
            doc.text(`Phone: ${customer.phoneNumber || 'N/A'}`, 80, 85);
            doc.text(`Address: ${customer.address || 'N/A'}`, 80, 95);
            doc.save(`customer_${customer.username}_profile.pdf`);
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
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Username: ${customer.username}`, 20, 50);
    doc.text(`Full Name: ${customer.fullName}`, 20, 60);
    doc.text(`Email: ${customer.email}`, 20, 70);
    doc.text(`Phone: ${customer.phoneNumber || 'N/A'}`, 20, 80);
    doc.text(`Address: ${customer.address || 'N/A'}`, 20, 90);
    doc.save(`customer_${customer.username}_profile.pdf`);
  };

  const downloadAllCustomersPDF = async () => {
    setIsLoading(true);
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(17, 153, 142);
      doc.rect(0, 0, 210, 40, 'F');
      doc.text('All Customers Report', 105, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 50, { align: 'center' });
      
      const tableData = filteredCustomerList.map(customer => [
        customer.userId,
        customer.username,
        customer.fullName,
        customer.email,
        customer.phoneNumber || 'N/A',
        customer.address || 'N/A'
      ]);
      
      doc.autoTable({
        startY: 60,
        head: [['ID', 'Username', 'Full Name', 'Email', 'Phone', 'Address']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [17, 153, 142],
          textColor: 255,
          fontStyle: 'bold',
          font: 'helvetica',
          fontSize: 10
        },
        bodyStyles: {
          font: 'helvetica',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [240, 245, 245]
        },
        margin: { top: 60 },
        styles: {
          cellPadding: 3,
          lineWidth: 0.2,
          lineColor: [200, 200, 200]
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
    <div className="customer-management">
      <div className="customer-header">
        <h1 className="customer-title">Customer Management</h1>
        <p className="customer-subtitle">Efficiently manage all customer information</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="bi bi-exclamation-octagon-fill"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="customer-controls">
        <div className="search-wrapper">
          <i className="bi bi-search"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="controls-right">
          <span className="total-count">
            <i className="bi bi-person-lines-fill"></i>
            {filteredCustomerList.length} Customers
          </span>
          <button
            onClick={downloadAllCustomersPDF}
            className="btn btn-export"
            disabled={isLoading || filteredCustomerList.length === 0}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-download"></i>
            )}
            Export All
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="loading-state">
                  <span className="spinner"></span>
                  Loading...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((customer, index) => (
                <tr key={customer.userId} className="customer-row">
                  <td>{getDisplayId(index)}</td>
                  <td>
                    {customer.image ? (
                      <div className="image-container">
                        <img
                          src={`http://localhost:8080/api/files/uploads/${customer.image}`}
                          alt="Customer"
                          className="customer-img"
                        />
                        <button
                          className="view-img-btn"
                          onClick={() => handleViewImage(`http://localhost:8080/api/files/uploads/${customer.image}`)}
                        >
                          <i className="bi bi-zoom-in"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="no-image">
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
                    <div className="action-btns">
                      <button
                        onClick={() => downloadCustomerPDF(customer)}
                        className="btn btn-pdf"
                        title="Download PDF"
                        disabled={isLoading}
                      >
                        <i className="bi bi-file-earmark-pdf"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.userId)}
                        className="btn btn-delete"
                        title="Delete Customer"
                        disabled={isLoading}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <i className="bi bi-info-circle"></i>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredCustomerList.length > itemsPerPage && (
        <div className="pagination">
          <button
            className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => paginate(currentPage - 1)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              className={`page-btn ${currentPage === number ? 'active' : ''}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}
          <button
            className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => paginate(currentPage + 1)}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}

      <div className="last-updated">
        <i className="bi bi-clock"></i>
        Last updated: {new Date().toLocaleString()}
      </div>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Customer Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <img
            src={currentImage}
            alt="Customer Full Size"
            className="modal-img"
          />
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <button className="btn btn-close-modal" onClick={() => setShowImageModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDetails;