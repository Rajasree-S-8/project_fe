import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Table, Button, Alert, Spinner, Modal, 
  Badge, Row, Col, Card, Tab, Tabs, Form, 
  Pagination, Dropdown, OverlayTrigger, Tooltip 
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  BsEye, BsPrinter, BsDownload, BsClockHistory, 
  BsCheckCircle, BsXCircle, BsArrowRepeat, BsFilter,
  BsSearch, BsCalendar, BsInfoCircle, BsStarFill,
  BsChevronDown, BsChevronUp, BsThreeDotsVertical,
  BsBoxSeam, BsTruck, BsCreditCard
} from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import { debounce } from 'lodash';

const API_BASE_URL = 'http://localhost:8080/api';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const fetchCustomerName = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${userId}`, {
        headers: {
          'X-Customer-Id': userId
        }
      });
      setCustomerName(response.data.fullName || 'N/A');
    } catch (err) {
      console.error('Failed to fetch customer name:', err);
      setCustomerName('N/A');
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const customer = JSON.parse(localStorage.getItem('customer'));
      if (!customer || !customer.userId) {
        navigate('/login');
        return;
      }

      await fetchCustomerName(customer.userId); // Fetch customer name

      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: {
          'X-Customer-Id': customer.userId
        }
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate, fetchCustomerName]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    let result = [...orders];

    if (activeTab !== 'all') {
      result = result.filter(order => order.status.toLowerCase() === activeTab);
    }

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status.toLowerCase() === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(order => {
        const orderDate = new Date(order.orderDate);
        
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            return orderDate >= startOfWeek;
          case 'month':
            return orderDate.getMonth() === now.getMonth() && 
                   orderDate.getFullYear() === now.getFullYear();
          case 'year':
            return orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderId.toString().includes(term) ||
        order.items.some(item => item.food?.name.toLowerCase().includes(term)) ||
        order.deliveryAddress.toLowerCase().includes(term) ||
        customerName.toLowerCase().includes(term)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [orders, activeTab, statusFilter, dateFilter, searchTerm, sortConfig, customerName]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const customer = JSON.parse(localStorage.getItem('customer'));
      if (!customer || !customer.userId) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            'X-Customer-Id': customer.userId
          }
        }
      );

      alert(response.data.message || 'Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'PPpp');
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <Badge bg="success" pill><BsCheckCircle className="me-1" /> {status}</Badge>;
      case 'pending':
        return <Badge bg="warning" pill><BsClockHistory className="me-1" /> {status}</Badge>;
      case 'cancelled':
        return <Badge bg="danger" pill><BsXCircle className="me-1" /> {status}</Badge>;
      case 'processing':
      case 'shipped':
        return <Badge bg="info" pill><BsArrowRepeat className="me-1" /> {status}</Badge>;
      default:
        return <Badge bg="secondary" pill>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge bg="success" pill><BsCreditCard className="me-1" /> Paid</Badge>;
      case 'pending':
        return <Badge bg="warning" pill><BsCreditCard className="me-1" /> Pending</Badge>;
      case 'failed':
        return <Badge bg="danger" pill><BsCreditCard className="me-1" /> Failed</Badge>;
      case 'refunded':
        return <Badge bg="secondary" pill><BsCreditCard className="me-1" /> Refunded</Badge>;
      default:
        return <Badge bg="secondary" pill><BsCreditCard className="me-1" /> {status}</Badge>;
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

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  const handleReorder = (order) => {
    navigate('/custfood', { state: { reorderItems: order.items } });
  };

  const handleRateOrder = (order) => {
    alert(`Rating system would open for order #${order.orderId}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <BsChevronUp /> : <BsChevronDown />;
  };

  const renderOrderStatusTimeline = (order) => {
    const statuses = [
      { id: 1, status: 'placed', label: 'Order Placed', icon: <BsBoxSeam />, date: order.orderDate },
      { id: 2, status: 'processing', label: 'Processing', icon: <BsArrowRepeat />, date: order.processingDate },
      { id: 3, status: 'shipped', label: 'Shipped', icon: <BsTruck />, date: order.shippedDate },
      { id: 4, status: 'delivered', label: 'Delivered', icon: <BsCheckCircle />, date: order.deliveredDate },
    ];
    
    const currentStatusIndex = statuses.findIndex(s => s.status === order.status.toLowerCase()) || 0;

    return (
      <div className="status-timeline">
        {statuses.map((step, index) => (
          <div 
            key={step.id} 
            className={`timeline-step ${index <= currentStatusIndex ? 'completed' : ''} ${index === currentStatusIndex ? 'current' : ''}`}
          >
            <div className="timeline-marker">
              {step.icon}
            </div>
            <div className="timeline-content">
              <h6>{step.label}</h6>
              {step.date && <small className="text-muted">{formatDate(step.date)}</small>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading && !isRefreshing) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5 customer-orders-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <BsClockHistory className="me-2" />
            My Orders
          </h2>
          <p className="text-muted mb-0">View and manage all your orders, {customerName}</p>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <BsArrowRepeat className={isRefreshing ? 'spin' : ''} /> 
            {isRefreshing ? ' Refreshing...' : ' Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mt-3">
          <BsInfoCircle className="me-2" />
          {error}
        </Alert>
      )}

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-3">
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <Form.Group className="mb-0">
                <div className="input-group search-box">
                  <span className="input-group-text bg-white border-end-0">
                    <BsSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search orders by ID, item name, address, or customer name"
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border-start-0"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 order-tabs"
        fill
      >
        <Tab eventKey="all" title={`All (${orders.length})`} />
        <Tab eventKey="pending" title={`Pending (${orders.filter(o => o.status === 'pending').length})`} />
        <Tab eventKey="processing" title={`Processing (${orders.filter(o => o.status === 'processing').length})`} />
        <Tab eventKey="shipped" title={`Shipped (${orders.filter(o => o.status === 'shipped').length})`} />
        <Tab eventKey="delivered" title={`Delivered (${orders.filter(o => o.status === 'delivered').length})`} />
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <div className="empty-state-icon mb-3">
              <BsBoxSeam size={48} className="text-muted" />
            </div>
            <h5>No orders found</h5>
            <p className="text-muted mb-4">You haven't placed any orders matching your criteria.</p>
            <Button variant="primary" onClick={() => navigate('/menu')}>
              Browse our menu
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="table-responsive">
            <Table hover className="order-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('orderId')} className="sortable">
                    <div className="d-flex align-items-center">
                      Order #
                      <span className="ms-1">{renderSortIcon('orderId')}</span>
                    </div>
                  </th>
                  <th>Customer</th>
                  <th onClick={() => handleSort('orderDate')} className="sortable">
                    <div className="d-flex align-items-center">
                      Date
                      <span className="ms-1">{renderSortIcon('orderDate')}</span>
                    </div>
                  </th>
                  <th>Items</th>
                  <th onClick={() => handleSort('total')} className="sortable">
                    <div className="d-flex align-items-center">
                      Total
                      <span className="ms-1">{renderSortIcon('total')}</span>
                    </div>
                  </th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(order => (
                  <tr key={order.orderId}>
                    <td>
                      <strong>#{order.orderId}</strong>
                    </td>
                    <td>{customerName}</td>
                    <td>
                      <small className="text-muted">{formatDate(order.orderDate)}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {order.items?.slice(0, 2).map(item => (
                          <div key={item.orderItemId} className="me-3 d-flex align-items-center">
                            {item.food?.image && (
                              <img 
                                src={item.food.image} 
                                alt={item.food.name} 
                                className="order-item-thumb me-2" 
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.src = '/placeholder-food.jpg'
                                }}
                              />
                            )}
                            <div>
                              <span className="d-block">{item.food?.name || 'Item'} (x{item.quantity})</span>
                              <small className="text-muted">₹{item.priceAtOrder?.toFixed(2)} each</small>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <Badge bg="light" text="dark" className="ms-2">
                            +{order.items.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="order-total">
                      ₹{calculateTotal(order.items)}
                    </td>
                    <td>
                      {getStatusBadge(order.status)}
                    </td>
                    <td>
                      {order.payments?.[0] ? (
                        getPaymentStatusBadge(order.payments[0].status)
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="order-actions">
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" id="dropdown-basic" className="d-flex align-items-center">
                          <BsThreeDotsVertical />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleViewDetails(order)}>
                            <BsEye className="me-2" /> View Details
                          </Dropdown.Item>
                          {order.status.toLowerCase() === 'delivered' && (
                            <>
                              <Dropdown.Item onClick={() => handleReorder(order)}>
                                <BsArrowRepeat className="me-2" /> Reorder
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleRateOrder(order)}>
                                <BsStarFill className="me-2" /> Rate Order
                              </Dropdown.Item>
                            </>
                          )}
                          {(order.status.toLowerCase() === 'pending' || 
                            order.status.toLowerCase() === 'processing' || 
                            order.status.toLowerCase() === 'completed') && (
                            <Dropdown.Item onClick={() => handleCancelOrder(order.orderId)}>
                              <BsXCircle className="me-2" /> Cancel Order
                            </Dropdown.Item>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={handlePrintOrder}>
                            <BsPrinter className="me-2" /> Print
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDownloadInvoice(order.orderId)}>
                            <BsDownload className="me-2" /> Invoice
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1} 
                />
                <Pagination.Prev 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1} 
                />
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Pagination.Item 
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages} 
                />
                <Pagination.Last 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages} 
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="xl"
        centered
        className="order-details-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <h4>Order Details #{selectedOrder?.orderId}</h4>
            {selectedOrder && (
              <div className="d-flex align-items-center mt-2">
                {getStatusBadge(selectedOrder.status)}
                <span className="ms-3 text-muted">
                  <BsCalendar className="me-1" />
                  {formatDate(selectedOrder.orderDate)}
                </span>
                <span className="ms-3 text-muted">
                  Customer: {customerName}
                </span>
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Row>
              <Col lg={8}>
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </Card.Header>
                  <Card.Body>
                    {renderOrderStatusTimeline(selectedOrder)}
                    
                    <div className="mt-4">
                      <h6 className="mb-3">Delivery Information</h6>
                      <Row>
                        <Col md={6}>
                          <div className="delivery-info-card p-3 mb-3">
                            <h6 className="mb-2">Delivery Address</h6>
                            <p className="mb-0">{selectedOrder.deliveryAddress}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          {selectedOrder.expectedDelivery && (
                            <div className="delivery-info-card p-3 mb-3">
                              <h6 className="mb-2">Expected Delivery</h6>
                              <p className="mb-0">{formatDate(selectedOrder.expectedDelivery)}</p>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Order Items</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table borderless className="mb-0 order-items-table">
                        <thead>
                          <tr className="border-bottom">
                            <th>Item</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Qty</th>
                            <th className="text-end">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items?.map(item => (
                            <tr key={item.orderItemId} className="border-bottom">
                              <td>
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={item.food?.image || '/placeholder-food.jpg'} 
                                    alt={item.food?.name} 
                                    className="order-item-image me-3" 
                                    onError={(e) => {
                                      e.target.onerror = null; 
                                      e.target.src = '/placeholder-food.jpg';
                                    }}
                                  />
                                  <div>
                                    <h6 className="mb-1">{item.food?.name || 'Item'}</h6>
                                    <small className="text-muted">
                                      {item.food?.description || 'No description available'}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td className="text-end">₹{item.priceAtOrder?.toFixed(2)}</td>
                              <td className="text-end">{item.quantity}</td>
                              <td className="text-end">
                                ₹{(item.priceAtOrder * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                            <td className="text-end">₹{calculateTotal(selectedOrder.items)}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Delivery Fee:</strong></td>
                            <td className="text-end">₹{selectedOrder.deliveryFee?.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Tax:</strong></td>
                            <td className="text-end">₹{selectedOrder.taxAmount?.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="border-top">
                            <td colSpan="3" className="text-end"><h6 className="mb-0">Total:</h6></td>
                            <td className="text-end">
                              <h6 className="mb-0">
                                ₹{(parseFloat(calculateTotal(selectedOrder.items)) + 
                                  (selectedOrder.deliveryFee || 0) + 
                                  (selectedOrder.taxAmount || 0)).toFixed(2)}
                              </h6>
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>

                {selectedOrder.notes && (
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Order Notes</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="order-notes p-3">
                        <p className="mb-0">{selectedOrder.notes}</p>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
              <Col lg={4}>
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Payment Information</h5>
                  </Card.Header>
                  <Card.Body>
                    {selectedOrder.payments?.length > 0 ? (
                      <div className="payment-details">
                        {selectedOrder.payments.map(payment => (
                          <div key={payment.paymentId} className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Status:</span>
                              <span>{getPaymentStatusBadge(payment.status)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Amount:</span>
                              <span>₹{payment.amount?.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Method:</span>
                              <span>{payment.paymentMethod}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Date:</span>
                              <span>{formatDate(payment.paymentDate)}</span>
                            </div>
                            {payment.transactionId && (
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Transaction ID:</span>
                                <span className="text-truncate" style={{ maxWidth: '150px' }}>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>{payment.transactionId}</Tooltip>}
                                  >
                                    <span>{payment.transactionId}</span>
                                  </OverlayTrigger>
                                </span>
                              </div>
                            )}
                            {payment.cardLastFour && (
                              <div className="d-flex justify-content-between">
                                <span className="text-muted">Card:</span>
                                <span>**** **** **** {payment.cardLastFour}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-muted">No payment information available</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Customer Support</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="support-card p-3 mb-3">
                      <p className="mb-3">
                        Need help with this order? Our customer service team is here to assist you.
                      </p>
                      <Button variant="outline-primary" className="me-2">
                        Contact Support
                      </Button>
                      {selectedOrder.status === 'delivered' && (
                        <Button variant="outline-secondary" onClick={() => handleRateOrder(selectedOrder)}>
                          <BsStarFill className="me-1" /> Rate Order
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Order Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => handleReorder(selectedOrder)}
                        disabled={selectedOrder.status === 'cancelled'}
                        className="mb-2"
                      >
                        Reorder All Items
                      </Button>
                      {(selectedOrder.status.toLowerCase() === 'pending' || 
                        selectedOrder.status.toLowerCase() === 'processing' || 
                        selectedOrder.status.toLowerCase() === 'completed') && (
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleCancelOrder(selectedOrder.orderId)}
                          className="mb-2"
                        >
                          <BsXCircle className="me-1" /> Cancel Order
                        </Button>
                      )}
                      <div className="d-flex gap-2">
                        <Button variant="outline-primary" onClick={handlePrintOrder} className="flex-grow-1">
                          <BsPrinter className="me-1" /> Print
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => handleDownloadInvoice(selectedOrder.orderId)} 
                          className="flex-grow-1"
                        >
                          <BsDownload className="me-1" /> Invoice
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerOrders;