import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CustHeader from '../header/CustHeader';
import './CustomerBooking.css';

const CustomerBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchBookings = async (attempt = 1) => {
    try {
      const customerData = localStorage.getItem('customer');
      if (!customerData) {
        throw new Error('No customer data found in localStorage');
      }

      const customer = JSON.parse(customerData);
      if (!customer?.userId) {
        throw new Error('User ID not found in customer data');
      }

      const response = await axios.get('http://localhost:8080/api/bookings/customer', {
        headers: {
          'X-Customer-Id': customer.userId,
          'Content-Type': 'application/json',
        },
      });

      const bookingsData = Array.isArray(response.data) ? response.data : [];
      
      // Check for payment success in URL params
      const searchParams = new URLSearchParams(location.search);
      const paymentSuccessParam = searchParams.get('paymentSuccess');
      const bookingIdParam = searchParams.get('bookingId');

      if (paymentSuccessParam === 'true' && bookingIdParam) {
        const successfulBooking = bookingsData.find(b => b.bookingId === parseInt(bookingIdParam));
        if (successfulBooking) {
          setPaymentSuccess(true);
        }
      }

      // Check if there's a new booking from navigation state
      const { paymentSuccess: success, bookingDetails } = location.state || {};
      let updatedBookings = bookingsData;

      if (success && bookingDetails) {
        const bookingExists = updatedBookings.some(b => b.bookingId === bookingDetails.bookingId);
        if (!bookingExists) {
          updatedBookings = [...updatedBookings, bookingDetails];
        }
        setPaymentSuccess(true);
      }

      setBookings(updatedBookings);
      setLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      let errorMessage = 'Failed to load bookings. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
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
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('customer')) {
      navigate('/custlog');
    } else {
      fetchBookings();
    }
  }, [location.state, location.search]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const customer = JSON.parse(localStorage.getItem('customer'));
      const response = await axios.get(`http://localhost:8080/api/bookings/${bookingId}/details`, {
        headers: {
          'X-Customer-Id': customer.userId,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      setLoading(true);
      const details = await fetchBookingDetails(bookingId);
      setCurrentBooking(details);
      setShowDetailsModal(true);
    } catch (error) {
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancelLoading((prev) => ({ ...prev, [bookingId]: true }));
      setError(null);
      const customer = JSON.parse(localStorage.getItem('customer'));
      
      const response = await axios.post(
        `http://localhost:8080/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            'X-Customer-Id': customer.userId,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setBookings(prev => prev.map(booking => 
          booking.bookingId === bookingId ? { ...booking, status: 'cancelled' } : booking
        ));
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      let errorMessage = 'Failed to cancel booking. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      setError(errorMessage);
    } finally {
      setCancelLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <CustHeader />
      <div className="bookings-hero">
        <div className="hero-overlay">
          <h1>My Bookings</h1>
          <p>View and manage your hotel bookings.</p>
        </div>
      </div>

      <Container className="my-5">
        {paymentSuccess && (
          <Alert variant="success" onClose={() => setPaymentSuccess(false)} dismissible>
            <Alert.Heading>Booking Successful!</Alert.Heading>
            <p>Your booking has been confirmed. Thank you for your reservation.</p>
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
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
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : bookings.length === 0 ? (
          <Alert variant="info">You have no bookings yet.</Alert>
        ) : (
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Your Bookings</Card.Title>
                  <Table responsive striped bordered hover>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Guests</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                          <td>{booking.bookingId || 'N/A'}</td>
                          <td>
                            <div>
                              <strong>{booking.room?.roomNumber || 'N/A'}</strong>
                              <div className="text-muted small">{booking.room?.roomType || 'N/A'}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>Check-in: {formatDate(booking.checkInDate)}</div>
                              <div>Check-out: {formatDate(booking.checkOutDate)}</div>
                            </div>
                          </td>
                          <td>{booking.guests || 'N/A'}</td>
                          <td>{booking.totalPrice ? `₹${booking.totalPrice.toLocaleString()}` : 'N/A'}</td>
                          <td>
                            <Badge
                              bg={
                                booking.status === 'confirmed'
                                  ? 'success'
                                  : booking.status === 'pending'
                                  ? 'warning'
                                  : 'danger'
                              }
                              pill
                            >
                              {booking.status || 'Unknown'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewDetails(booking.bookingId)}
                              >
                                View Details
                              </Button>
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking.bookingId)}
                                  disabled={cancelLoading[booking.bookingId]}
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Booking Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentBooking ? (
            <div className="booking-details">
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Booking Information</h5>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <th>Booking ID</th>
                        <td>{currentBooking.bookingId}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <Badge 
                            bg={
                              currentBooking.status === 'confirmed'
                                ? 'success'
                                : currentBooking.status === 'pending'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {currentBooking.status}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <th>Booking Date</th>
                        <td>{formatDate(currentBooking.bookingDate)}</td>
                      </tr>
                      <tr>
                        <th>Check-in</th>
                        <td>{formatDate(currentBooking.checkInDate)}</td>
                      </tr>
                      <tr>
                        <th>Check-out</th>
                        <td>{formatDate(currentBooking.checkOutDate)}</td>
                      </tr>
                      <tr>
                        <th>Guests</th>
                        <td>{currentBooking.guests}</td>
                      </tr>
                      <tr>
                        <th>Total Price</th>
                        <td>₹{currentBooking.totalPrice?.toLocaleString() || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5>Room Information</h5>
                  {currentBooking.room && (
                    <Table bordered>
                      <tbody>
                        <tr>
                          <th>Room Number</th>
                          <td>{currentBooking.room.roomNumber}</td>
                        </tr>
                        <tr>
                          <th>Room Type</th>
                          <td>{currentBooking.room.roomType}</td>
                        </tr>
                        <tr>
                          <th>Price Per Night</th>
                          <td>₹{currentBooking.room.price?.toLocaleString() || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Capacity</th>
                          <td>{currentBooking.room.capacity}</td>
                        </tr>
                        <tr>
                          <th>Amenities</th>
                          <td>{currentBooking.room.amenities || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>

              {currentBooking.payments && currentBooking.payments.length > 0 && (
                <Row>
                  <Col>
                    <h5>Payment Information</h5>
                    <Table striped bordered>
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBooking.payments.map((payment) => (
                          <tr key={payment.paymentId}>
                            <td>{payment.transactionId}</td>
                            <td>₹{payment.amount}</td>
                            <td>
                              {payment.paymentMethod}
                              {payment.cardLastFour && ` (****${payment.cardLastFour})`}
                            </td>
                            <td>{formatDateTime(payment.paymentDate)}</td>
                            <td>
                              <Badge bg={payment.status === 'completed' ? 'success' : 'warning'}>
                                {payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
            </div>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerBooking;