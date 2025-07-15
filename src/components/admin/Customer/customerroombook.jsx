import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Table, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';

const CustomerRoomBookingDetails = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerId] = useState(localStorage.getItem('customerId')); // Assuming you store customer ID after login

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/bookings/${bookingId}/details`, {
          headers: {
            'X-Customer-Id': customerId
          }
        });
        
        if (response.data) {
          setBookingDetails(response.data);
        } else {
          setError('Booking details not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, customerId]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:8080/api/bookings/${bookingId}/cancel`,
          {},
          {
            headers: {
              'X-Customer-Id': customerId
            }
          }
        );
        
        if (response.data.message) {
          // Refresh booking details after cancellation
          const updatedDetails = await axios.get(
            `http://localhost:8080/api/bookings/${bookingId}/details`,
            {
              headers: {
                'X-Customer-Id': customerId
              }
            }
          );
          setBookingDetails(updatedDetails.data);
          alert('Booking cancelled successfully');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel booking');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: bookingDetails?.payments?.[0]?.currency || 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!bookingDetails) {
    return (
      <Container>
        <Alert variant="info">No booking details found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Booking Details</h2>
      
      <Card className="mb-4">
        <Card.Header as="h5">Booking Summary</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Booking ID:</strong></td>
                    <td>{bookingDetails.bookingId}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>
                      <span className={`badge ${
                        bookingDetails.status === 'confirmed' ? 'bg-success' :
                        bookingDetails.status === 'pending' ? 'bg-warning text-dark' :
                        bookingDetails.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {bookingDetails.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Booking Date:</strong></td>
                    <td>{formatDate(bookingDetails.bookingDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Room Type:</strong></td>
                    <td>{bookingDetails.room?.roomType}</td>
                  </tr>
                  <tr>
                    <td><strong>Room Number:</strong></td>
                    <td>{bookingDetails.room?.roomNumber}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Check-in Date:</strong></td>
                    <td>{formatDate(bookingDetails.checkInDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Check-out Date:</strong></td>
                    <td>{formatDate(bookingDetails.checkOutDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Number of Guests:</strong></td>
                    <td>{bookingDetails.guests}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Price:</strong></td>
                    <td>{formatCurrency(bookingDetails.totalPrice)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          
          {bookingDetails.status === 'pending' && (
            <div className="d-flex justify-content-end mt-3">
              <Button 
                variant="danger" 
                onClick={handleCancelBooking}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Cancel Booking'}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header as="h5">Customer Information</Card.Header>
        <Card.Body>
          <Table borderless>
            <tbody>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{bookingDetails.customer?.name}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{bookingDetails.customer?.email}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {bookingDetails.payments && bookingDetails.payments.length > 0 && (
        <Card>
          <Card.Header as="h5">Payment Information</Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails.payments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td>{payment.paymentId}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>{payment.paymentMethod}</td>
                    <td>
                      <span className={`badge ${
                        payment.status === 'completed' ? 'bg-success' :
                        payment.status === 'pending' ? 'bg-warning text-dark' :
                        payment.status === 'failed' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{formatDate(payment.paymentDate)}</td>
                    <td>{payment.transactionId || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CustomerRoomBookingDetails;