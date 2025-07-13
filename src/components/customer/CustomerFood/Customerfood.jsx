import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Offcanvas, Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Customerfood.css';

const CART_STORAGE_KEY = 'foodCart';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/food/available');
      setFoodItems(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError('Failed to load menu. Please try again later.');
      setLoading(false);
      toast.error('Failed to load menu. Please try again later.');
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodId === item.foodId);
      if (existing) {
        return prev.map((i) =>
          i.foodId === item.foodId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
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
      prev.map((item) =>
        item.foodId === foodId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

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

      const response = await axios.post(
        'http://localhost:8080/api/orders/',
        orderData,
        {
          headers: {
            'X-Customer-Id': customer.userId,
          },
        }
      );

      setOrderSuccess(true);
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

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
          <Button
            variant="link"
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchFoodItems();
            }}
            className="ms-2"
          >
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

      <div className="cart-button">
        <Button
          variant="primary"
          onClick={() => setShowCart(true)}
          className="rounded-circle p-3"
        >
          🛒 {cart.length > 0 && <Badge bg="danger">{cart.length}</Badge>}
        </Button>
      </div>

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

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Total Amount:</strong> ₹{calculateTotal()}</p>
          <p><strong>Delivery Address:</strong> {deliveryAddress}</p>
          <p><strong>Items:</strong></p>
          <ul>
            {cart.map((item) => (
              <li key={item.foodId}>
                {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p>Are you sure you want to place this order?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowConfirmModal(false);
              placeOrder();
            }}
            disabled={orderProcessing}
          >
            {orderProcessing ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Processing...
              </>
            ) : (
              'Confirm Order'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Order</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {orderSuccess ? (
            <div className="text-center">
              <Alert variant="success">
                <h4>Order Placed Successfully!</h4>
                <p>Your order has been received and is being prepared.</p>
                <Button
                  variant="success"
                  onClick={() => {
                    setShowCart(false);
                    setOrderSuccess(false);
                    navigate('/customer/orders', { state: { orderSuccess: true } });
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
                    onClick={() => setShowConfirmModal(true)}
                    disabled={!deliveryAddress || deliveryAddress.trim().length < 10 || orderProcessing}
                    className="w-100 mt-3"
                  >
                    {orderProcessing ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      'Review & Place Order'
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