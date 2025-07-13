import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Modal, Carousel, Spinner, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';
import axios from 'axios';
import './Customerroom.css';

const Customerroom = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [paymentData, setPaymentData] = useState({
    cardType: 'credit',
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    address: '',
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/rooms/available');
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError(`Failed to load rooms: ${error.message}`);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetails(true);
    setBookingSuccess(false);
    setBookingId(null);
    setError(null);
    setBookingData({
      checkIn: '',
      checkOut: '',
      guests: 1,
    });
    setPaymentData({
      cardType: 'credit',
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: '',
      address: '',
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const calculateTotalPrice = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut) return 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffDays = Math.round(Math.abs((checkOut - checkIn) / oneDay));
    return diffDays > 0 ? selectedRoom.price * diffDays : 0;
  };

  const handleBookNow = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);

    if (checkIn < today) {
      setError('Check-in date cannot be in the past');
      return;
    }

    if (checkIn >= checkOut) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (!selectedRoom?.roomId) {
      setError('No room selected');
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);
      const customer = JSON.parse(localStorage.getItem('customer'));
      if (!customer?.userId) {
        throw new Error('User not logged in');
      }

      const bookingPayload = {
        roomId: selectedRoom.roomId,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
      };

      const response = await axios.post(
        'http://localhost:8080/api/bookings/',
        bookingPayload,
        {
          headers: {
            'X-Customer-Id': customer.userId,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setBookingSuccess(true);
        setBookingId(response.data.bookingId);
        setPaymentData((prev) => ({
          ...prev,
          name: customer.fullName || '',
        }));
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      let errorMessage = 'Booking failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setBookingLoading(false);
    }
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
      const totalPrice = calculateTotalPrice() * bookingData.guests;

      const paymentPayload = {
        bookingId: bookingId,
        amount: totalPrice,
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
        navigate('/my-bookings', {
          state: {
            paymentSuccess: true,
            bookingId: bookingId,
            paymentId: paymentResponse.data.paymentId,
          },
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      let errorMessage = 'Payment failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.error || `Error ${error.response.status}: ${error.response.statusText}`;
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

  return (
    <>
      <CustHeader />
      <div className="rooms-hero">
        <div className="hero-overlay">
          <h1>Discover Our Luxurious Rooms</h1>
          <p>Choose from our selection of premium rooms designed for comfort and elegance.</p>
        </div>
      </div>

      <Container className="my-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {rooms.map((room) => (
              <Col key={room.roomId}>
                <Card className="room-card">
                  <div className="room-image-container">
                    <Card.Img
                      variant="top"
                      src={room.imageUrl || '/images/room-placeholder.jpg'}
                      className="room-image"
                    />
                    <Badge bg={room.isAvailable ? 'success' : 'danger'} className="room-badge">
                      {room.isAvailable ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                  <Card.Body>
                    <Card.Title className="room-title">Room {room.roomNumber}</Card.Title>
                    <Card.Text>
                      <span className="room-price">₹{room.price.toLocaleString()} / day</span>
                      <br />
                      <span>Type: {room.roomType}</span>
                      <br />
                      <span>AC: {room.acType}</span>
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleViewDetails(room)}
                      disabled={!room.isAvailable}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Room {selectedRoom?.roomNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <>
              {bookingSuccess ? (
                <div className="payment-container">
                  <Alert variant="success">
                    <Alert.Heading>Booking Confirmed!</Alert.Heading>
                    <p>
                      Your booking for Room {selectedRoom.roomNumber} from {bookingData.checkIn} to{' '}
                      {bookingData.checkOut} has been confirmed. Please complete the payment to secure
                      your reservation.
                    </p>
                    <hr />
                    <p className="mb-0">Total: ₹{(calculateTotalPrice() * bookingData.guests).toLocaleString()}</p>
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
                            <Form.Control type="text" value={`Room ${selectedRoom.roomNumber}`} readOnly />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control
                              type="text"
                              value={`₹${(calculateTotalPrice() * bookingData.guests).toLocaleString()}`}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Booking Reference</Form.Label>
                            <Form.Control type="text" value={`BOOK-${bookingId}`} readOnly />
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
              ) : (
                <>
                  <Carousel className="mb-4">
                    <Carousel.Item>
                      <img
                        className="d-block w-100 room-detail-image"
                        src={selectedRoom.imageUrl || '/images/room-placeholder.jpg'}
                        alt={`Room ${selectedRoom.roomNumber}`}
                      />
                    </Carousel.Item>
                  </Carousel>

                  <div className="booking-form-container">
                    <Row>
                      <Col md={6}>
                        <h4>₹{selectedRoom.price.toLocaleString()}</h4>
                        <p className="text-muted">per day</p>

                        <Form.Group className="mb-3">
                          <Form.Label>Check-in Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="checkIn"
                            value={bookingData.checkIn}
                            onChange={handleBookingChange}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Check-out Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="checkOut"
                            value={bookingData.checkOut}
                            onChange={handleBookingChange}
                            min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Number of Guests</Form.Label>
                          <Form.Control
                            type="number"
                            name="guests"
                            min="1"
                            max="4"
                            value={bookingData.guests}
                            onChange={handleBookingChange}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <div className="booking-summary">
                          <h5>Booking Summary</h5>
                          <div className="summary-item">
                            <span>Room:</span>
                            <span>Room {selectedRoom.roomNumber}</span>
                          </div>
                          <div className="summary-item">
                            <span>Type:</span>
                            <span>{selectedRoom.roomType}</span>
                          </div>
                          <div className="summary-item">
                            <span>AC Type:</span>
                            <span>{selectedRoom.acType}</span>
                          </div>
                          {bookingData.checkIn && bookingData.checkOut && (
                            <>
                              <div className="summary-item">
                                <span>Duration:</span>
                                <span>
                                  {Math.round(
                                    (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) /
                                      (1000 * 60 * 60 * 24)
                                  )}{' '}
                                  days
                                </span>
                              </div>
                              <div className="summary-item">
                                <span>Guests:</span>
                                <span>{bookingData.guests}</span>
                              </div>
                              <div className="summary-item total">
                                <span>Total:</span>
                                <span>₹{(calculateTotalPrice() * bookingData.guests).toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!bookingSuccess ? (
            <>
              <Button variant="outline-secondary" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleBookNow}
                disabled={!bookingData.checkIn || !bookingData.checkOut || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Processing...</span>
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </>
          ) : (
            <Button variant="success" onClick={proceedToPayment} disabled={paymentLoading}>
              {paymentLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Processing Payment...</span>
                </>
              ) : (
                'Complete Payment'
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Customerroom;