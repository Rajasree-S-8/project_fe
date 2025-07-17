import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table, Badge, Modal, Form, FormControl, Pagination } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import HeaderNavbar from '../header1/header1';

const CustomerBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const maxRetries = 3;

  const getCustomerId = () => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      navigate('/custlog');
      return null;
    }
    try {
      const customer = JSON.parse(customerData);
      return customer?.userId || null;
    } catch (e) {
      console.error('Error parsing customer data:', e);
      return null;
    }
  };

  const fetchBookings = async (attempt = 1) => {
    try {
      const customerId = getCustomerId();
      if (!customerId) return;

      const response = await axios.get('http://localhost:8080/api/bookings/customer', {
        headers: {
          'X-Customer-Id': customerId.toString(),
          'Content-Type': 'application/json',
        },
      });

      const bookingsData = Array.isArray(response.data) ? response.data : [];
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      setLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      let errorMessage = 'Failed to load bookings. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
        if (error.response.status === 401 || error.response.status === 403) {
          navigate('/custlog');
          return;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }

      if (attempt < maxRetries) {
        setTimeout(() => {
          setRetryCount(attempt);
          fetchBookings(attempt + 1);
        }, 2000);
      } else {
        setError(errorMessage);
        setLoading(false);
        setBookings([]);
        setFilteredBookings([]);
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('customer')) {
      navigate('/custlog');
    } else {
      fetchBookings();
    }
  }, [location.state, location.search, navigate]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      setDetailsLoading(true);
      const customerId = getCustomerId();
      if (!customerId) {
        throw new Error('Customer not authenticated');
      }

      const response = await axios.get(`http://localhost:8080/api/bookings/${bookingId}/details`, {
        headers: {
          'X-Customer-Id': customerId.toString(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('No booking details received');
      }

      return response.data;
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.config?.headers,
      });

      let errorMessage = 'Failed to load booking details.';
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'You are not authorized to view these details.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      throw new Error(errorMessage);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      setError(null);
      const details = await fetchBookingDetails(bookingId);
      setCurrentBooking(details);
      setShowDetailsModal(true);
    } catch (error) {
      setError(error.message);
      setShowDetailsModal(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
    
    const filtered = bookings.filter(booking => 
      booking.room?.roomNumber?.toString().toLowerCase().includes(query) ||
      booking.bookingId?.toString().toLowerCase().includes(query) ||
      booking.status?.toLowerCase().includes(query)
    );
    setFilteredBookings(filtered);
  };

const handleDownloadPDF = async () => {
  if (!currentBooking) return;

  try {
    const customerId = getCustomerId();
    if (!customerId) {
      throw new Error('Customer not authenticated');
    }

    const response = await axios.get(
      `http://localhost:8080/api/bookings/${currentBooking.bookingId}/download`,
      {
        headers: {
          'X-Customer-Id': customerId.toString(),
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Important for file downloads
      }
    );

    // Create a blob URL for the PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `booking_${currentBooking.bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    setError('Failed to download PDF. Please try again.');
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending Payment</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="bookings-hero">
      <HeaderNavbar />
        <div className="hero-overlay">
          <h1>My Bookings</h1>
          <p>View your hotel reservations</p>
        </div>
      </div>

      <Container className="my-5">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
            {retryCount > 0 && (
              <div className="mt-2">
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    fetchBookings();
                  }}
                >
                  Retry ({maxRetries - retryCount} left)
                </Button>
              </div>
            )}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <Alert variant="info">
            <Alert.Heading>No Bookings Found</Alert.Heading>
            <p>You haven't made any bookings yet.</p>
          </Alert>
        ) : (
          <Row>
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Card.Title className="mb-0">Your Bookings</Card.Title>
                    <Form className="d-flex">
                      <FormControl
                        type="search"
                        placeholder="Search by Room #, Booking ID, or Status"
                        className="me-2"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </Form>
                  </div>
                  <div className="table-responsive">
                    <Table striped hover className="align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Booking ID</th>
                          <th>Room Details</th>
                          <th>Booking Dates</th>
                          <th>Guests</th>
                          <th>Total Price</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBookings.map((booking, index) => (
                          <tr key={booking.bookingId || index}>
                            <td>{indexOfFirstBooking + index + 1}</td>
                            <td>{booking.bookingId}</td>
                            <td>
                              <div>
                                <strong>Room #{booking.room?.roomNumber || 'N/A'}</strong>
                                <div className="text-muted small">{booking.room?.roomType || 'N/A'}</div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</div>
                                <div><strong>Check-out:</strong> {formatDate(booking.checkOutDate)}</div>
                              </div>
                            </td>
                            <td className="text-center">{booking.guests || 'N/A'}</td>
                            <td className="text-end">{booking.totalPrice ? `₹${booking.totalPrice.toFixed(2)}` : 'N/A'}</td>
                            <td className="text-center">
                              {getStatusBadge(booking.status)}
                            </td>
                            <td className="text-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewDetails(booking.bookingId)}
                                disabled={detailsLoading}
                              >
                                {detailsLoading && currentBooking?.bookingId === booking.bookingId ? (
                                  <>
                                    <Spinner as="span" size="sm" animation="border" role="status" />
                                    <span className="ms-2">Loading...</span>
                                  </>
                                ) : (
                                  'View'
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                      <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="xl" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            Booking Details - #{currentBooking?.bookingId || ''}
            {detailsLoading && (
              <Spinner animation="border" size="sm" className="ms-2" />
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!detailsLoading && currentBooking ? (
            <div className="booking-details">
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Booking Information</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table borderless className="mb-0">
                        <tbody>
                          <tr>
                            <th width="40%">Booking ID:</th>
                            <td>{currentBooking.bookingId}</td>
                          </tr>
                          <tr>
                            <th>Status:</th>
                            <td>{getStatusBadge(currentBooking.status)}</td>
                          </tr>
                          <tr>
                            <th>Booking Date:</th>
                            <td>{formatDate(currentBooking.bookingDate)}</td>
                          </tr>
                          <tr>
                            <th>Check-in:</th>
                            <td>{formatDate(currentBooking.checkInDate)}</td>
                          </tr>
                          <tr>
                            <th>Check-out:</th>
                            <td>{formatDate(currentBooking.checkOutDate)}</td>
                          </tr>
                          <tr>
                            <th>Duration:</th>
                            <td>
                              {currentBooking.checkInDate && currentBooking.checkOutDate ? 
                                `${Math.ceil((new Date(currentBooking.checkOutDate) - new Date(currentBooking.checkInDate)) / (1000 * 60 * 60 * 24))} nights` : 
                                'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <th>Guests:</th>
                            <td>{currentBooking.guests}</td>
                          </tr>
                          <tr>
                            <th>Total Price:</th>
                            <td className="fw-bold">₹{currentBooking.totalPrice?.toFixed(2) || 'N/A'}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Room Information</h5>
                    </Card.Header>
                    <Card.Body>
                      {currentBooking.room && (
                        <Table borderless className="mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Room Number:</th>
                              <td>{currentBooking.room.roomNumber}</td>
                            </tr>
                            <tr>
                              <th>Room Type:</th>
                              <td>{currentBooking.room.roomType}</td>
                            </tr>
                            <tr>
                              <th>Price Per Night:</th>
                              <td>₹{currentBooking.room.price?.toFixed(2) || 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>AC Type:</th>
                              <td>{currentBooking.room.acType || 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Capacity:</th>
                              <td>{currentBooking.room.capacity || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {currentBooking.customer && (
                <Row className="mb-4">
                  <Col>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Customer Information</h5>
                      </Card.Header>
                      <Card.Body>
                        <Table borderless className="mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Name:</th>
                              <td>{currentBooking.customer.name || 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Email:</th>
                              <td>{currentBooking.customer.email || 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Customer ID:</th>
                              <td>{currentBooking.customer.userId || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {currentBooking.payments && currentBooking.payments.length > 0 && (
                <Row>
                  <Col>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Payment History</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="table-responsive">
                          <Table striped hover>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentBooking.payments.map((payment, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-nowrap">{payment.transactionId || 'N/A'}</td>
                                  <td className="text-end">₹{payment.amount?.toFixed(2) || '0.00'}</td>
                                  <td>
                                    {payment.paymentMethod === 'credit_card' ? 'Credit Card' : 
                                     payment.paymentMethod === 'debit_card' ? 'Debit Card' : 
                                     payment.paymentMethod || 'N/A'}
                                  </td>
                                  <td className="text-nowrap">{formatDateTime(payment.paymentDate)}</td>
                                  <td>
                                    {payment.status === 'completed' ? 
                                      <Badge bg="success">Completed</Badge> : 
                                      <Badge bg="warning">Pending</Badge>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading booking details...</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerBooking;