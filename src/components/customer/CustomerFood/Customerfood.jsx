import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Offcanvas, Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Customerfood.css';

const CART_STORAGE_KEY = 'foodCart';
const API_BASE_URL = 'http://localhost:8080/api';

const Customerfood = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Fetch available food items
  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/food/available`, {
        timeout: 10000,
      });
      setFoodItems(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load menu. Please try again later.');
      setLoading(false);
      toast.error('Failed to load menu. Please try again later.');
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Cart management functions
  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodId === item.foodId);
      return existing
        ? prev.map((i) => (i.foodId === item.foodId ? { ...i, quantity: i.quantity + quantity } : i))
        : [...prev, { ...item, quantity }];
    });
    toast.success(`${item.name} added to cart!`);
  };

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity < 1) {
      const removedItem = cart.find((item) => item.foodId === foodId);
      setCart((prev) => prev.filter((item) => item.foodId !== foodId));
      toast.info(`${removedItem.name} removed from cart`);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.foodId === foodId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  // Order processing functions
  const placeOrder = async () => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (!deliveryAddress || deliveryAddress.trim().length < 10) {
      toast.error('Please enter a valid delivery address (at least 10 characters)');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setOrderProcessing(true);

    try {
      const orderData = {
        deliveryAddress: deliveryAddress.trim(),
        items: cart.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          'X-Customer-Id': customer.userId,
          'Content-Type': 'application/json',
        },
      });

      setCurrentOrder(response.data);
      setOrderSuccess(true);
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      toast.success('Order placed successfully! Please complete the payment.');
      setShowPaymentModal(true);
    } catch (error) {
      handleOrderError(error);
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleOrderError = (error) => {
    let errorMessage = 'Failed to place order. Please try again.';
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data || errorMessage;
      } else if (error.response.status === 403) {
        errorMessage = 'You are not authorized to perform this action. Please login again.';
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to the server. Please check your connection.';
    }
    toast.error(errorMessage);
  };

  // Payment processing
  const handleCompletePayment = async () => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer || !currentOrder) {
      toast.error('Please login and place an order first');
      setShowPaymentModal(false);
      return;
    }

    if (!validatePaymentDetails()) return;

    setPaymentProcessing(true);

    try {
      const paymentRequest = {
        cardLastFour: paymentDetails.cardNumber.slice(-4),
      };

      const response = await axios.post(
        `${API_BASE_URL}/orders/${currentOrder.orderId}/payment`,
        paymentRequest,
        {
          headers: {
            'X-Customer-Id': customer.userId,
            'Content-Type': 'application/json',
          },
        }
      );

      setCurrentOrder(response.data);
      setShowPaymentModal(false);
      toast.success('Payment completed successfully!');
    } catch (error) {
      handlePaymentError(error);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const validatePaymentDetails = () => {
    if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv || !paymentDetails.name) {
      toast.error('Please fill all payment details');
      return false;
    }

    if (paymentDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }

    if (!paymentDetails.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    if (!paymentDetails.cvv.match(/^[0-9]{3,4}$/)) {
      toast.error('Please enter a valid CVV (3 or 4 digits)');
      return false;
    }

    return true;
  };

  const handlePaymentError = (error) => {
    let errorMessage = 'Payment failed. Please try again.';
    if (error.response) {
      if (error.response.status === 403) {
        errorMessage = 'You are not authorized to perform this action. Please login again.';
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    }
    toast.error(errorMessage);
  };

  // Loading and error states
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading menu...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">
          {error}
          <Button variant="link" onClick={fetchFoodItems} className="ms-2">
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <CustHeader />
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Main Menu Display */}
      <Container className="mt-4">
        <h2 className="mb-4">Our Menu</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {foodItems.map((item) => (
            <Col key={item.foodId}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={item.image || '/images/food-placeholder.jpg'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text className="text-muted">{item.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">₹{item.price}</span>
                    <Badge bg={item.isAvailable ? 'success' : 'danger'}>
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </Badge>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetails(true);
                    }}
                    disabled={!item.isAvailable}
                  >
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Floating Cart Button */}
      <div className="cart-button">
        <Button
          variant="primary"
          onClick={() => setShowCart(true)}
          className="rounded-circle p-3"
        >
          🛒 {cart.length > 0 && <Badge bg="danger">{cart.length}</Badge>}
        </Button>
      </div>

      {/* Food Item Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <img
                src={selectedItem.image || '/images/food-placeholder.jpg'}
                alt={selectedItem.name}
                className="img-fluid mb-3"
              />
              <p><strong>Price:</strong> ₹{selectedItem.price}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              {selectedItem.recipe && <p><strong>Recipe:</strong> {selectedItem.recipe}</p>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addToCart(selectedItem);
              setShowDetails(false);
            }}
            disabled={!selectedItem?.isAvailable}
          >
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MM/YY"
                  value={paymentDetails.expiry}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                />
              </Col>
              <Col md={6}>
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                />
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={paymentDetails.name}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCompletePayment}
            disabled={
              paymentProcessing ||
              !paymentDetails.cardNumber ||
              !paymentDetails.expiry ||
              !paymentDetails.cvv ||
              !paymentDetails.name
            }
          >
            {paymentProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              'Complete Payment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Shopping Cart Offcanvas */}
      <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Order</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {orderSuccess ? (
            <div className="text-center">
              <Alert variant="success">
                <h4>Order Placed Successfully!</h4>
                <p>
                  {currentOrder?.status === 'completed'
                    ? 'Your order has been confirmed and is being prepared.'
                    : 'Please complete the payment to confirm your order.'}
                </p>
                <Button
                  variant="success"
                  onClick={() => {
                    setShowCart(false);
                    setOrderSuccess(false);
                    navigate('/my-orders');
                  }}
                  className="w-100 mt-3"
                >
                  View Order Details
                </Button>
              </Alert>
            </div>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  placeholder="Enter your complete delivery address"
                />
              </Form.Group>

              {cart.length === 0 ? (
                <p className="text-center">Your cart is empty</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div
                        key={item.foodId}
                        className="d-flex justify-content-between align-items-center mb-3"
                      >
                        <div>
                          <h6>{item.name}</h6>
                          <p>₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="d-flex align-items-center">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-top pt-3">
                    <h5 className="text-end">Total: ₹{calculateTotal()}</h5>
                  </div>

                  <Button
                    variant="primary"
                    onClick={placeOrder}
                    disabled={!deliveryAddress || deliveryAddress.trim().length < 10 || orderProcessing}
                    className="w-100 mt-3"
                  >
                    {orderProcessing ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </>
              )}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Customerfood;