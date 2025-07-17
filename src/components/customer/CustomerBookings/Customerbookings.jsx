import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table, Badge, Modal, Form, FormControl, Pagination } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CustHeader from '../header/CustHeader';
import './CustomerBooking.css';

const CustomerBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [cancelMessage, setCancelMessage] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const maxRetries = 3;

  const [paymentData, setPaymentData] = useState({
    cardType: 'credit',
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    address: '',
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentData((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePaymentData = () => {
    const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      return 'Invalid card number. Must be 16 digits.';
    }
    if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
      return 'Invalid expiry date. Use MM/YY format.';
    }
    if (!/^\d{3}$/.test(paymentData.cvv)) {
      return 'Invalid CVV. Must be 3 digits.';
    }
    if (!paymentData.name.trim()) {
      return 'Cardholder name is required.';
    }
    if (!paymentData.address.trim()) {
      return 'Billing address is required.';
    }
    return null;
  };

  const proceedToPayment = async () => {
    const validationError = validatePaymentData();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setPaymentLoading(true);
      setError(null);
      const customer = JSON.parse(localStorage.getItem('customer'));
      if (!customer?.userId) {
        throw new Error('User not logged in');
      }

      const paymentPayload = {
        bookingId: currentBooking.bookingId,
        amount: currentBooking.totalPrice,
        currency: 'INR',
        paymentMethod: paymentData.cardType === 'credit' ? 'credit_card' : 'debit_card',
        paymentDetails: {
          cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
          expiry: paymentData.expiry,
          cvv: paymentData.cvv,
          name: paymentData.name,
          address: paymentData.address,
          cardType: paymentData.cardType,
        },
      };

      const paymentResponse = await axios.post(
        'http://localhost:8080/api/payments/process',
        paymentPayload,
        {
          headers: {
            'X-Customer-Id': customer.userId,
            'Content-Type': 'application/json',
          },
        }
      );

      if (paymentResponse.status === 200) {
        setPaymentSuccess(true);
        setShowPaymentModal(false);
        fetchBookings();
      }
    } catch (error) {
      console.error('Payment error:', error);
      let errorMessage = 'Payment failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

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
      let updatedBookings = [...bookingsData];

      const searchParams = new URLSearchParams(location.search);
      const paymentSuccessParam = searchParams.get('paymentSuccess');
      const bookingIdParam = searchParams.get('bookingId');

      if (paymentSuccessParam === 'true' && bookingIdParam) {
        const successfulBooking = updatedBookings.find(b => b.bookingId === parseInt(bookingIdParam));
        if (successfulBooking) {
          setPaymentSuccess(true);
        }
      }

      const { paymentSuccess: success, bookingDetails } = location.state || {};
      if (success && bookingDetails) {
        const bookingExists = updatedBookings.some(b => b.bookingId === bookingDetails.bookingId);
        if (!bookingExists && bookingDetails) {
          updatedBookings = [bookingDetails, ...updatedBookings];
        }
        setPaymentSuccess(true);
      }

      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
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

  const handleCancelConfirmation = (booking) => {
    setBookingToCancel(booking);
    setCancelMessage('');
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      setCancelLoading((prev) => ({ ...prev, [bookingToCancel.bookingId]: true }));
      setError(null);
      const customerId = getCustomerId();
      if (!customerId) return;
      
      const response = await axios.post(
        `http://localhost:8080/api/bookings/${bookingToCancel.bookingId}/cancel`,
        {},
        {
          headers: {
            'X-Customer-Id': customerId.toString(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setBookings(prev => prev.map(booking => 
          booking.bookingId === bookingToCancel.bookingId ? { ...booking, status: 'cancelled' } : booking
        ));
        setFilteredBookings(prev => prev.map(booking => 
          booking.bookingId === bookingToCancel.bookingId ? { ...booking, status: 'cancelled' } : booking
        ));
        
        const refundAmount = response.data?.refundAmount || 0;
        
        setCancelMessage(
          refundAmount > 0 
            ? `Your booking has been cancelled. A refund of ₹${refundAmount.toFixed(2)} will be processed to your original payment method within 5-7 business days.`
            : 'Your booking has been cancelled successfully.'
        );
        
        if (currentBooking?.bookingId === bookingToCancel.bookingId) {
          setCurrentBooking(prev => ({ ...prev, status: 'cancelled' }));
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', {
        error: error,
        response: error.response?.data,
      });
      
      let errorMessage = 'Failed to cancel booking. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      setCancelMessage(errorMessage);
    } finally {
      setCancelLoading((prev) => ({ ...prev, [bookingToCancel.bookingId]: false }));
    }
  };

  const handlePayNow = (booking) => {
    setCurrentBooking(booking);
    setPaymentData({
      cardType: 'credit',
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: booking.customer?.name || '',
      address: '',
    });
    setShowPaymentModal(true);
    setError(null);
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
    if (!currentBooking) {
      setError('No booking selected for download');
      return;
    }

    try {
      const customerId = getCustomerId();
      if (!customerId) {
        setError('Customer not authenticated');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/bookings/${currentBooking.bookingId}/download`, {
        headers: {
          'X-Customer-Id': customerId.toString(),
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking_${currentBooking.bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'visa':
        return <i className="fab fa-cc-visa me-2"></i>;
      case 'mastercard':
        return <i className="fab fa-cc-mastercard me-2"></i>;
      case 'amex':
        return <i className="fab fa-cc-amex me-2"></i>;
      case 'discover':
        return <i className="fab fa-cc-discover me-2"></i>;
      default:
        return <i className="far fa-credit-card me-2"></i>;
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
      <CustHeader />
      <div className="bookings-hero">
        <div className="hero-overlay">
          <h1>My Bookings</h1>
          <p>Manage your hotel reservations with ease</p>
        </div>
      </div>

      <Container className="my-5">
        {paymentSuccess && (
          <Alert variant="success" onClose={() => setPaymentSuccess(false)} dismissible>
            <Alert.Heading>Payment Successful!</Alert.Heading>
            <p>Your payment has been processed successfully. Thank you!</p>
          </Alert>
        )}
        
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
                    <Table striped hover className="align-middle modern-table">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Room Details</th>
                          <th>Booking Dates</th>
                          <th>Guests</th>
                          <th>Total Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBookings.map((booking, index) => (
                          <tr key={booking.bookingId || index}>
                            <td>{indexOfFirstBooking + index + 1}</td>
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
                                <div className="text-muted small">
                                  {booking.checkInDate && booking.checkOutDate ? 
                                    `${Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} Day` : 
                                    'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="text-center">{booking.guests || 'N/A'}</td>
                            <td className="text-end">{booking.totalPrice ? `₹${booking.totalPrice.toFixed(2)}` : 'N/A'}</td>
                            <td className="text-center">
                              {getStatusBadge(booking.status)}
                            </td>
                            <td className="text-center">
                              <div className="d-flex flex-column gap-2">
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
                                    'View Details'
                                  )}
                                </Button>
                                {booking.status === 'pending' && (
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handlePayNow(booking)}
                                  >
                                    Pay Now
                                  </Button>
                                )}
                                {booking.status !== 'cancelled' && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleCancelConfirmation(booking)}
                                    disabled={cancelLoading[booking.bookingId] || new Date(booking.checkInDate) < new Date()}
                                  >
                                    {cancelLoading[booking.bookingId] ? (
                                      <>
                                        <Spinner
                                          as="span"
                                          animation="border"
                                          size="sm"
                                          role="status"
                                          aria-hidden="true"
                                        />
                                        <span className="ms-2">Cancelling...</span>
                                      </>
                                    ) : (
                                      'Cancel'
                                    )}
                                  </Button>
                                )}
                              </div>
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
                                <th>Card Details</th>
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
                                    {getPaymentMethodIcon(payment.cardBrand)}
                                    {payment.paymentMethod === 'credit_card' ? 'Credit Card' : 
                                     payment.paymentMethod === 'debit_card' ? 'Debit Card' : 
                                     payment.paymentMethod || 'N/A'}
                                  </td>
                                  <td>
                                    {payment.cardBrand && payment.cardLastFour ? 
                                      `${payment.cardBrand} ending in ${payment.cardLastFour}` : 
                                      'N/A'}
                                    {payment.cardType && (
                                      <span className="text-muted ms-2">({payment.cardType})</span>
                                    )}
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
          {currentBooking?.status === 'pending' && (
            <Button 
              variant="success" 
              onClick={() => {
                setShowDetailsModal(false);
                handlePayNow(currentBooking);
              }}
            >
              Pay Now
            </Button>
          )}
          {currentBooking?.status !== 'cancelled' && (
            <Button 
              variant="danger" 
              onClick={() => {
                setShowDetailsModal(false);
                handleCancelConfirmation(currentBooking);
              }}
              disabled={new Date(currentBooking?.checkInDate) < new Date()}
            >
              Cancel Booking
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking #{bookingToCancel?.bookingId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cancelMessage ? (
            <Alert variant={cancelMessage.includes('refund') ? 'success' : 'danger'}>
              {cancelMessage}
            </Alert>
          ) : (
            <>
              <p>Are you sure you want to cancel this booking?</p>
              {bookingToCancel?.payments?.some(p => p.status === 'completed') && (
                <Alert variant="info">
                  <strong>Refund Policy:</strong> 
                  <ul className="mb-0">
                    <li>Cancellation before check-in: 80% refund</li>
                    <li>After check-in: No refund</li>
                    <li>Refunds take 5-7 business days to process</li>
                  </ul>
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!cancelMessage ? (
            <>
              <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                No, Keep Booking
              </Button>
              <Button 
                variant="danger" 
                onClick={handleCancelBooking}
                disabled={cancelLoading[bookingToCancel?.bookingId] || new Date(bookingToCancel?.checkInDate) < new Date()}
              >
                {cancelLoading[bookingToCancel?.bookingId] ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" />
                    <span className="ms-2">Cancelling...</span>
                  </>
                ) : (
                  'Yes, Cancel Booking'
                )}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setShowCancelModal(false)}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Complete Payment for Booking #{currentBooking?.bookingId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentBooking && (
            <div className="payment-container">
              <Alert variant="info" className="mb-4">
                <p>You are about to pay for your booking of Room {currentBooking.room?.roomNumber}.</p>
                <p className="mb-0"><strong>Total Amount:</strong> ₹{currentBooking.totalPrice?.toFixed(2) || '0.00'}</p>
              </Alert>

              <div className="payment-form">
                <h4>Payment Information</h4>
                <Alert variant="info" className="mb-4">
                  This is a secure payment form. Your information will be encrypted.
                </Alert>

                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Room Number</Form.Label>
                        <Form.Control type="text" value={`Room ${currentBooking.room?.roomNumber || 'N/A'}`} readOnly />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Total Amount</Form.Label>
                        <Form.Control
                          type="text"
                          value={`₹${currentBooking.totalPrice?.toFixed(2) || '0.00'}`}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Booking Reference</Form.Label>
                        <Form.Control type="text" value={`BOOK-${currentBooking.bookingId}`} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="mt-4">Payment Details</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Card Type</Form.Label>
                    <Form.Select
                      name="cardType"
                      value={paymentData.cardType}
                      onChange={handlePaymentChange}
                      required
                    >
                      <option value="credit">Credit Card</option>
                      <option value="debit">Debit Card</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                          type="text"
                          name="expiry"
                          value={paymentData.expiry}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength="3"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Cardholder Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={paymentData.name}
                      onChange={handlePaymentChange}
                      placeholder="As shown on card"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Billing Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={paymentData.address}
                      onChange={handlePaymentChange}
                      placeholder="123 Main St, City, Country"
                      required
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={proceedToPayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              'Complete Payment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerBooking;