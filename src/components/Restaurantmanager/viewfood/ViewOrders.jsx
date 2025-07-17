import React, { useState, useEffect } from 'react';
import { 
  Container, Table, Button, Alert, Spinner, Modal, 
  Badge, Row, Col, Card, Form, Pagination, Dropdown 
} from 'react-bootstrap';
import { BsEye, BsPrinter, BsDownload, BsStarFill, BsSearch } from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "../header/Header.jsx";

const API_BASE_URL = 'http://localhost:8080/api';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem('customer'));
        if (!customer || !customer.userId) {
          navigate('/login');
          return;
        }

        setCustomerName(customer.fullName || customer.username);

        const response = await axios.get(`${API_BASE_URL}/orders`, {
          headers: {
            'X-Customer-Id': customer.userId
          }
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'PPpp');
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Badge bg="success" className="px-3 py-2 rounded-pill">{status}</Badge>;
      case 'pending':
        return <Badge bg="warning" className="px-3 py-2 rounded-pill text-dark">{status}</Badge>;
      case 'cancelled':
        return <Badge bg="danger" className="px-3 py-2 rounded-pill">{status}</Badge>;
      case 'processing':
        return <Badge bg="primary" className="px-3 py-2 rounded-pill">{status}</Badge>;
      case 'shipped':
        return <Badge bg="info" className="px-3 py-2 rounded-pill text-dark">{status}</Badge>;
      default:
        return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.priceAtOrder || 0) * (item.quantity || 1);
    }, 0).toFixed(2);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const customer = JSON.parse(localStorage.getItem('customer'));
      if (!customer || !customer.userId) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/invoice`, {
        headers: {
          'X-Customer-Id': customer.userId
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download invoice');
    }
  };

  const handleRateOrder = (order) => {
    alert(`Rating system would open for order #${order.orderId}`);
  };

  const filteredOrders = orders.filter(order => 
    order.orderId.toString().includes(searchTerm) ||
    order.items.some(item => item.food?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customerName && customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <h4 className="mt-3 text-primary">Loading your orders...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light">
      <Header />
      
      <Container className="py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-primary fw-bold">My Orders</h1>
          <div className="position-relative" style={{ width: '300px' }}>
            <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <Form.Control
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-5 rounded-pill border-0 shadow-sm"
              style={{ height: '45px' }}
            />
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="rounded-lg shadow-sm">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {filteredOrders.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
            <Card.Body className="text-center py-5">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
                alt="No orders" 
                style={{ width: '120px', opacity: 0.7 }} 
                className="mb-4"
              />
              <h4 className="text-muted mb-3">No Orders Found</h4>
              <p className="text-muted">You haven't placed any orders yet.</p>
              <Button 
                variant="primary" 
                className="rounded-pill px-4 mt-3"
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Card className="border-0 shadow-sm rounded-lg overflow-hidden mb-4">
              <Table hover responsive className="mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="ps-4 py-3">Order #</th>
                    <th className="py-3">Customer</th> {/* Added Customer column */}
                    <th className="py-3">Date</th>
                    <th className="py-3">Items</th>
                    <th className="py-3">Total</th>
                    <th className="py-3">Status</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(order => (
                    <tr key={order.orderId} className="border-bottom">
                      <td className="ps-4 fw-bold align-middle">#{order.orderId}</td>
                      <td className="align-middle">{customerName}</td> {/* Display customer name */}
                      <td className="align-middle">
                        <div className="text-muted">{formatDate(order.orderDate)}</div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <span className="text-primary fw-bold">{order.items.length}</span>
                            </div>
                          </div>
                          <div>
                            {order.items.slice(0, 2).map(item => (
                              <div key={item.orderItemId} className="text-truncate" style={{ maxWidth: '150px' }}>
                                {item.food?.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold align-middle">₹{calculateTotal(order.items)}</td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          {getStatusBadge(order.status)}
                        </div>
                      </td>
                      <td className="pe-4 text-end align-middle">
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-primary" 
                            size="sm" 
                            className="rounded-pill px-3 border-0 bg-light"
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="shadow-sm border-0 rounded-lg">
                            <Dropdown.Item 
                              onClick={() => handleViewDetails(order)}
                              className="d-flex align-items-center"
                            >
                              <BsEye className="me-2" /> View Details
                            </Dropdown.Item>
                            {order.status === 'delivered' && (
                              <Dropdown.Item 
                                onClick={() => handleRateOrder(order)}
                                className="d-flex align-items-center"
                              >
                                <BsStarFill className="me-2" /> Rate Order
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item 
                              onClick={handlePrintOrder}
                              className="d-flex align-items-center"
                            >
                              <BsPrinter className="me-2" /> Print
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => handleDownloadInvoice(order.orderId)}
                              className="d-flex align-items-center"
                            >
                              <BsDownload className="me-2" /> Download Invoice
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="mb-0">
                  <Pagination.Prev 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="rounded-pill mx-1"
                  />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                      className="rounded-circle mx-1"
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="rounded-pill mx-1"
                  />
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Order Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="border-0 pb-0 bg-light">
            <Modal.Title className="fw-bold text-primary">
              <i className="bi bi-receipt me-2"></i>
              Order #{selectedOrder?.orderId}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-1">
            {selectedOrder && (
              <>
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <div>
                        <div className="text-muted small">Order Date</div>
                        <div className="fw-medium">{formatDate(selectedOrder.orderDate)}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light p-3 rounded">
                      <div className="text-muted small">Customer</div>
                      <div className="fw-medium">{customerName}</div>
                    </div>
                  </Col>
                </Row>

                <h5 className="mb-3 fw-bold border-bottom pb-2">Order Items</h5>
                <div className="mb-4">
                  {selectedOrder.items.map(item => (
                    <Card key={item.orderItemId} className="mb-3 border-0 shadow-sm">
                      <Card.Body className="p-3">
                        <Row className="align-items-center">
                          <Col xs={3} md={2}>
                            <img 
                              src={item.food?.image || '/placeholder-food.jpg'} 
                              alt={item.food?.name} 
                              className="img-fluid rounded"
                              style={{ maxHeight: '80px', objectFit: 'cover' }}
                            />
                          </Col>
                          <Col xs={9} md={10}>
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1 fw-bold">{item.food?.name}</h6>
                              <span className="text-primary fw-bold">
                                ₹{(item.priceAtOrder * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            <p className="small text-muted mb-2">{item.food?.description}</p>
                            <div className="d-flex justify-content-between">
                              <span className="small">
                                <span className="text-muted">Price:</span> ₹{item.priceAtOrder?.toFixed(2)}
                              </span>
                              <span className="small">
                                <span className="text-muted">Qty:</span> {item.quantity}
                              </span>
                            </div>
                            {item.specialInstructions && (
                              <div className="mt-2 small">
                                <span className="text-muted">Notes:</span> {item.specialInstructions}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <h5 className="mb-3 fw-bold border-bottom pb-2">Order Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Subtotal:</span>
                      <span>₹{calculateTotal(selectedOrder.items)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Delivery Fee:</span>
                      <span>₹{selectedOrder.deliveryFee?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Tax:</span>
                      <span>₹{selectedOrder.taxAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold pt-3 border-top">
                      <span>Total:</span>
                      <span className="text-primary">
                        ₹{(parseFloat(calculateTotal(selectedOrder.items)) + 
                          (selectedOrder.deliveryFee || 0) + 
                          (selectedOrder.taxAmount || 0)).toFixed(2)}
                      </span>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <h5 className="mb-3 fw-bold border-bottom pb-2">Delivery Information</h5>
                    <div className="mb-2">
                      <div className="text-muted small">Address</div>
                      <p className="mb-0 fw-medium">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </Card.Body>
                </Card>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowModal(false)}
              className="rounded-pill px-4"
            >
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleDownloadInvoice(selectedOrder?.orderId)}
              className="rounded-pill px-4"
            >
              Download Invoice
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ViewOrders;