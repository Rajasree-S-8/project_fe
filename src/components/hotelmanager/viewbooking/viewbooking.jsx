import React, { useState, useEffect } from 'react';
import { Card, Container, Table, Button, Modal, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './viewbooking.css';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bookings/all', {
          headers: {
            'X-Staff-Id': JSON.parse(localStorage.getItem('staff'))?.staffId
          }
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleShowDetails = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/${bookingId}`, {
        headers: {
          'X-Staff-Id': JSON.parse(localStorage.getItem('staff'))?.staffId
        }
      });
      setSelectedBooking(response.data);
      setShowDetails(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load booking details');
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card>
        <Card.Header>View Bookings</Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Created By</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>#{booking.bookingId}</td>
                    <td>{booking.customer?.fullName || 'N/A'}</td>
                    <td>{booking.room?.roomNumber || 'N/A'}</td>
                    <td>{booking.room?.createdBy?.fullname || 'N/A'}</td>
                    <td>{formatDate(booking.checkInDate)}</td>
                    <td>{formatDate(booking.checkOutDate)}</td>
                    <td>
                      <Badge bg={
                        booking.status === 'confirmed' ? 'success' :
                        booking.status === 'cancelled' ? 'danger' : 'warning'
                      }>
                        {booking.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowDetails(booking.bookingId)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details #{selectedBooking?.bookingId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Room Information</h5>
                  <p>
                    <strong>Room Number:</strong> {selectedBooking.room?.roomNumber || 'N/A'}<br />
                    <strong>Room Type:</strong> {selectedBooking.room?.roomType || 'N/A'}<br />
                    <strong>Capacity:</strong> {selectedBooking.room?.capacity || 'N/A'}<br />
                    <strong>Price per night:</strong> ₹{selectedBooking.room?.price?.toFixed(2) || 'N/A'}<br />
                    <strong>Created By:</strong> {selectedBooking.room?.createdBy?.fullname || 'N/A'}<br />
                    <strong>Staff Email:</strong> {selectedBooking.room?.createdBy?.email || 'N/A'}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Booking Information</h5>
                  <p>
                    <strong>Check-in:</strong> {formatDate(selectedBooking.checkInDate)}<br />
                    <strong>Check-out:</strong> {formatDate(selectedBooking.checkOutDate)}<br />
                    <strong>Guests:</strong> {selectedBooking.guests}<br />
                    <strong>Status:</strong> <Badge bg={
                      selectedBooking.status === 'confirmed' ? 'success' :
                      selectedBooking.status === 'cancelled' ? 'danger' : 'warning'
                    }>
                      {selectedBooking.status}
                    </Badge>
                  </p>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col>
                  <h5>Payment Information</h5>
                  {selectedBooking.payments && selectedBooking.payments.length > 0 ? (
                    selectedBooking.payments.map((payment, index) => (
                      <p key={index}>
                        <strong>Payment ID:</strong> {payment.paymentId}<br />
                        <strong>Amount:</strong> ₹{payment.amount.toFixed(2)}<br />
                        <strong>Status:</strong> {payment.status}<br />
                        <strong>Payment Method:</strong> {payment.paymentMethod}<br />
                        <strong>Card Brand:</strong> {payment.cardBrand || 'N/A'}<br />
                        <strong>Card Last Four:</strong> {payment.cardLastFour || 'N/A'}<br />
                        <strong>Transaction ID:</strong> {payment.transactionId}<br />
                        <strong>Payment Date:</strong> {formatDate(payment.paymentDate)}
                      </p>
                    ))
                  ) : (
                    <p>No payment information available</p>
                  )}
                </Col>
              </Row>
              
              <Row>
                <Col>
                  <h5>Customer Information</h5>
                  <p>
                    <strong>Name:</strong> {selectedBooking.customer?.fullName || 'N/A'}<br />
                    <strong>Email:</strong> {selectedBooking.customer?.email || 'N/A'}<br />
                    <strong>Phone:</strong> {selectedBooking.customer?.phoneNumber || 'N/A'}<br />
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewBookings;