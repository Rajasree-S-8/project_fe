import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Button, 
  Badge, 
  Row, 
  Col, 
  Alert, 
  Spinner, 
  Table,
  Breadcrumb
} from 'react-bootstrap';
import axios from 'axios';
import './viewbooking.css';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.userId) {
          setAuthError(true);
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/bookings/${bookingId}/details`, {
          headers: {
            'X-Customer-Id': user.userId
          }
        });
        setBooking(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setAuthError(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load booking details');
        }
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    
    try {
      setCancelling(true);
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(`/api/bookings/${bookingId}/cancel`, {}, {
        headers: {
          'X-Customer-Id': user.userId
        }
      });
      
      // Refresh booking details after cancellation
      const response = await axios.get(`/api/bookings/${bookingId}/details`, {
        headers: {
          'X-Customer-Id': user.userId
        }
      });
      setBooking(response.data);
      setCancelling(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      setCancelling(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: `/bookings/${bookingId}` } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateNights = (checkIn, checkOut) => {
    const diffTime = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading booking details...</p>
      </Container>
    );
  }

  if (authError) {
    return (
      <Container className="my-5 py-5">
        <Alert variant="danger" className="text-center">
          <div className="py-4">
            <h4 className="mb-3">Authentication Required</h4>
            <p>You need to be logged in to view this booking</p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button 
                variant="primary" 
                onClick={handleLoginRedirect}
                className="px-4"
              >
                Login Now
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
                className="px-4"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 py-5">
        <Alert variant="danger" className="text-center">
          <div className="py-4">
            <h4 className="mb-3">Error Loading Booking</h4>
            <p>{error}</p>
            <Button 
              variant="outline-primary" 
              onClick={() => window.location.reload()}
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="my-5 py-5">
        <Alert variant="warning" className="text-center">
          <div className="py-4">
            <h4 className="mb-3">Booking Not Found</h4>
            <p>The requested booking could not be found in our system.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/my-bookings')}
              className="mt-3"
            >
              View My Bookings
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

  return (
    <Container className="my-5 booking-details-container">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/my-bookings' }}>My Bookings</Breadcrumb.Item>
        <Breadcrumb.Item active>Booking #{booking.bookingId}</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center py-3">
          <h2 className="mb-0">Booking #{booking.bookingId}</h2>
          <Badge 
            pill 
            bg={
              booking.status === 'confirmed' ? 'success' :
              booking.status === 'cancelled' ? 'danger' : 
              booking.status === 'completed' ? 'info' : 'warning'
            }
            className="fs-6 px-3 py-2"
          >
            {booking.status.toUpperCase()}
          </Badge>
        </Card.Header>
        
        <Card.Body className="p-4">
          <Row className="g-4">
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Room Information</h5>
                </Card.Header>
                <Card.Body>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '140px' }}>Room Type:</td>
                        <td>{booking.room?.roomType || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Room Number:</td>
                        <td>{booking.room?.roomNumber || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Price per night:</td>
                        <td>{formatCurrency(booking.room?.price)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Capacity:</td>
                        <td>{booking.room?.capacity || 'N/A'} guests</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Amenities:</td>
                        <td>
                          {booking.room?.amenities ? (
                            <ul className="list-unstyled mb-0">
                              {booking.room.amenities.split(',').map((amenity, i) => (
                                <li key={i}>{amenity.trim()}</li>
                              ))}
                            </ul>
                          ) : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Booking Dates</h5>
                </Card.Header>
                <Card.Body>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '140px' }}>Check-in:</td>
                        <td>{formatDate(booking.checkInDate)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Check-out:</td>
                        <td>{formatDate(booking.checkOutDate)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Nights:</td>
                        <td>{nights}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Guests:</td>
                        <td>{booking.guests}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Booking Date:</td>
                        <td>{formatDate(booking.bookingDate)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Payment Summary</h5>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered className="mb-0">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {booking.room?.roomType} @ {formatCurrency(booking.room?.price)}/night × {nights} nights
                        </td>
                        <td className="text-end">{formatCurrency(booking.room?.price * nights)}</td>
                      </tr>
                      {booking.taxAmount > 0 && (
                        <tr>
                          <td>Taxes and Fees</td>
                          <td className="text-end">{formatCurrency(booking.taxAmount)}</td>
                        </tr>
                      )}
                      <tr className="fw-bold">
                        <td>Total Amount</td>
                        <td className="text-end">{formatCurrency(booking.totalPrice)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {booking.payments && booking.payments.length > 0 && (
            <Row className="mt-4">
              <Col>
                <Card>
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Payment History</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                      <Table striped bordered hover className="mb-0">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Transaction ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {booking.payments.map((payment, index) => (
                            <tr key={index}>
                              <td>{formatDate(payment.paymentDate)}</td>
                              <td>{formatCurrency(payment.amount)}</td>
                              <td>{payment.paymentMethod}</td>
                              <td>
                                <Badge 
                                  bg={
                                    payment.status === 'completed' ? 'success' :
                                    payment.status === 'failed' ? 'danger' : 'warning'
                                  }
                                  className="text-capitalize"
                                >
                                  {payment.status}
                                </Badge>
                              </td>
                              <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                {payment.transactionId}
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
          
          <Row className="mt-4">
            <Col className="d-flex justify-content-between align-items-center">
              <Button 
                variant="outline-secondary" 
                as={Link} 
                to="/my-bookings"
                className="px-4"
              >
                <i className="bi bi-arrow-left me-2"></i>Back to My Bookings
              </Button>
              
              {booking.status === 'pending' && (
                <Button 
                  variant="danger" 
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="px-4"
                >
                  {cancelling ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle me-2"></i>Cancel Booking
                    </>
                  )}
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingDetails;