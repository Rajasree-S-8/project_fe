import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Modal, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import CustHeader from '../header/CustHeader';
import axios from 'axios';
import './Customerorders.css';

const Customerorders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const customer = JSON.parse(localStorage.getItem('customer'));

  useEffect(() => {
    if (!customer) {
      navigate('/custlog');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8080/api/orders/customer', {
          headers: {
            'X-Customer-Id': customer.userId,
          },
        });
        setOrders(response.data);
        if (location.state?.orderSuccess) {
          setOrderSuccess(true);
          navigate('.', { replace: true, state: {} });
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, customer, location.state]);

  const handleCancelOrder = async (orderId) => {
    try {
      setCancelLoading(true);
      setError(null);
      await axios.put( // Changed from POST to PUT as it's more semantically correct for updates
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            'X-Customer-Id': customer.userId,
          },
        }
      );
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleShowDetails = async (orderId) => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
        headers: {
          'X-Customer-Id': customer.userId,
        },
      });
      setSelectedOrder(response.data);
      setShowDetails(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load order details');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') return <Badge bg="success">Completed</Badge>;
    if (statusLower === 'cancelled') return <Badge bg="danger">Cancelled</Badge>;
    return <Badge bg="warning">Pending</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your orders...</p>
      </Container>
    );
  }

  return (
    <>
      <CustHeader />
      <Container className="my-5">
        <h2>Your Food Orders</h2>

        {orderSuccess && (
          <Alert variant="success" dismissible onClose={() => setOrderSuccess(false)}>
            Order placed successfully!
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {orders.length === 0 ? (
          <Alert variant="info">
            You have no orders yet. <a href="/custfood">Order food now</a>.
          </Alert>
        ) : (
          <Table striped bordered hover responsive className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Delivery Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>
                    {order.items?.map((item, index) => (
                      <div key={index}>
                        {item.food?.name || 'Unknown Item'} (x{item.quantity})
                      </div>
                    )) || 'No items'}
                  </td>
                  <td>₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>
                    {getStatusBadge(order.status)}
                  </td>
                  <td>{order.deliveryAddress || 'N/A'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowDetails(order.orderId)}
                      >
                        Details
                      </Button>
                      {order.status?.toLowerCase() === 'pending' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={cancelLoading}
                        >
                          {cancelLoading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" />
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
        )}

        <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Order Details #{selectedOrder?.orderId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <h5>Order Items</h5>
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="mb-3">
                        <strong>{item.food?.name || 'Unknown Item'}</strong><br />
                        Quantity: {item.quantity}<br />
                        Price: ₹{item.price?.toFixed(2) || '0.00'}<br />
                        {item.food?.staff && (
                          <>
                            Prepared By: {item.food.staff.fullname || 'N/A'}<br />
                            Staff Contact: {item.food.staff.email || 'N/A'}
                          </>
                        )}
                      </div>
                    )) || <p>No items found</p>}
                  </Col>
                  <Col md={6}>
                    <h5>Order Information</h5>
                    <div className="mb-3">
                      <strong>Order ID:</strong> {selectedOrder.orderId}<br />
                      <strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}<br />
                      <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress || 'N/A'}<br />
                      <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}<br />
                      <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h5>Payment Information</h5>
                    {selectedOrder.payments?.length > 0 ? (
                      selectedOrder.payments.map((payment, index) => (
                        <div key={index} className="mb-3">
                          <strong>Payment ID:</strong> {payment.paymentId}<br />
                          <strong>Amount:</strong> ₹{payment.amount?.toFixed(2) || '0.00'}<br />
                          <strong>Status:</strong> {payment.status || 'N/A'}<br />
                          <strong>Payment Method:</strong> {payment.paymentMethod || 'N/A'}<br />
                          <strong>Transaction ID:</strong> {payment.transactionId || 'N/A'}<br />
                          <strong>Payment Date:</strong> {formatDate(payment.paymentDate)}
                        </div>
                      ))
                    ) : (
                      <p>No payment information available</p>
                    )}
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
    </>
  );
};

export default Customerorders;