// src/components/restaurantmanager/restaurantmanager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  Form, 
  Pagination, 
  Dropdown, 
  Badge, 
  Spinner, 
  Alert, 
  Modal, 
  Button, 
  FormControl, 
  FormCheck,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import './RestaurantManager.css';

const RestaurantManager = ({ isActive, staffId }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [foodForm, setFoodForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    recipe: '',
    isAvailable: true
  });
  const [imagePreview, setImagePreview] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewFood, setViewFood] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFoodId, setDeleteFoodId] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/food/');
        setFoodItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch food items');
        console.error('Fetch food items error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isActive) {
      fetchFoodItems();
    }
  }, [isActive]);

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && item.isAvailable) || 
      (availabilityFilter === 'unavailable' && !item.isAvailable);
    return matchesSearch && matchesAvailability;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/food/');
      setFoodItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh food items');
      console.error('Refresh data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/food/${id}/availability`, {}, {
        headers: {
          'staffId': staffId,
        },
      });
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle availability');
      console.error('Toggle availability error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalType('add');
    setFoodForm({
      name: '',
      price: '',
      image: '',
      description: '',
      recipe: '',
      isAvailable: true
    });
    setImagePreview('');
    setShowFoodModal(true);
  };

  const openEditModal = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/food/${id}`);
      const food = response.data;
      setModalType('edit');
      setFoodForm({
        name: food.name || '',
        price: food.price ? food.price.toString() : '',
        image: food.image || '',
        description: food.description || '',
        recipe: food.recipe || '',
        isAvailable: food.isAvailable ?? true
      });
      setImagePreview(food.image || '');
      setShowFoodModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch food item');
      console.error('Fetch food item for edit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFoodForm(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleFoodSubmit = async () => {
    if (!foodForm.name || !foodForm.price || !foodForm.image || !foodForm.description) {
      setError('Please fill in all required fields (Name, Price, Image, Description).');
      return;
    }

    try {
      setLoading(true);
      const foodData = {
        name: foodForm.name,
        price: parseFloat(foodForm.price),
        image: foodForm.image,
        description: foodForm.description,
        recipe: foodForm.recipe,
        isAvailable: foodForm.isAvailable
      };

      if (modalType === 'add') {
        await axios.post('http://localhost:8080/api/food/', foodData, {
          headers: {
            'staffId': staffId,
          },
        });
      } else {
        await axios.put(`http://localhost:8080/api/food/${viewFood?.foodId}`, foodData, {
          headers: {
            'staffId': staffId,
          },
        });
      }

      setShowFoodModal(false);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${modalType === 'add' ? 'add' : 'update'} food item`);
      console.error(`${modalType === 'add' ? 'Add' : 'Update'} food error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/food/${id}`);
      setViewFood(response.data);
      setShowViewModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch food item details');
      console.error('Fetch food item for view error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteFoodId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/food/${deleteFoodId}`, {
        headers: {
          'staffId': staffId,
        },
      });
      setShowDeleteModal(false);
      setDeleteFoodId(null);
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete food item');
      console.error('Delete food item error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="container mt-4 restaurant-manager">
      <h1 className="h3 fw-bold mb-1">Restaurant Manager</h1>
      <p className="text-muted mb-4">Manage Food Items</p>
      
      <Card className="shadow">
        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Foods</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by food name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filter by Availability</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100">
                    {availabilityFilter === 'all' ? 'All Items' : 
                     availabilityFilter === 'available' ? 'Available Only' : 'Unavailable Only'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item onClick={() => setAvailabilityFilter('all')}>All Items</Dropdown.Item>
                    <Dropdown.Item onClick={() => setAvailabilityFilter('available')}>Available Only</Dropdown.Item>
                    <Dropdown.Item onClick={() => setAvailabilityFilter('unavailable')}>Unavailable Only</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Col>
            
            <Col md={3} className="d-flex align-items-end">
              <Button 
                variant="primary"
                className="w-100"
                onClick={openAddModal}
                disabled={loading}
              >
                <i className="bi bi-plus-circle me-2"></i> Add Food
              </Button>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading food items...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-dark">
                    <tr>
                      <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                        Food Name {sortConfig.key === 'name' && (
                          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th>Image</th>
                      <th onClick={() => requestSort('price')} style={{ cursor: 'pointer' }}>
                        Price {sortConfig.key === 'price' && (
                          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th>Description</th>
                      <th onClick={() => requestSort('isAvailable')} style={{ cursor: 'pointer' }}>
                        Status {sortConfig.key === 'isAvailable' && (
                          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item.foodId}>
                          <td className="fw-bold">{item.name || 'N/A'}</td>
                          <td>
                            <img 
                              src={item.image || 'https://via.placeholder.com/60?text=No+Image'} 
                              alt={item.name || 'Food Image'} 
                              className="food-image-thumbnail"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                              }}
                            />
                          </td>
                          <td>₹{item.price ? item.price.toFixed(2) : 'N/A'}</td>
                          <td className="description-cell">
                            <div className="text-truncate" title={item.description}>
                              {item.description || 'No description'}
                            </div>
                          </td>
                          <td>
                            <Badge bg={item.isAvailable ? 'success' : 'danger'}>
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => openEditModal(item.foodId)}
                                disabled={loading}
                              >
                                <i className="bi bi-pencil me-1"></i> Edit
                              </Button>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => openViewModal(item.foodId)}
                                disabled={loading}
                              >
                                <i className="bi bi-eye me-1"></i> View
                              </Button>
                              <Button
                                variant={item.isAvailable ? 'warning' : 'success'}
                                size="sm"
                                onClick={() => toggleAvailability(item.foodId)}
                                disabled={loading}
                              >
                                {item.isAvailable ? (
                                  <>
                                    <i className="bi bi-x-circle me-1"></i> Unavailable
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-check-circle me-1"></i> Available
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => openDeleteModal(item.foodId)}
                                disabled={loading}
                              >
                                <i className="bi bi-trash me-1"></i> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-emoji-frown fs-1 text-muted mb-2"></i>
                            <h5>No food items found</h5>
                            <p className="text-muted">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
                  </div>
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)} 
                      disabled={currentPage === 1} 
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
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
        </Card.Body>
      </Card>

      <Modal show={showFoodModal} onHide={() => setShowFoodModal(false)} centered size="lg">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            {modalType === 'add' ? 'Add New Food Item' : `Edit ${foodForm.name}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Food Name *</Form.Label>
                  <FormControl
                    name="name"
                    type="text"
                    placeholder="Enter food name"
                    value={foodForm.name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <FormControl
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    value={foodForm.price}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <FormControl
                    name="description"
                    as="textarea"
                    placeholder="Enter food description"
                    rows={3}
                    value={foodForm.description}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Recipe</Form.Label>
                  <FormControl
                    name="recipe"
                    as="textarea"
                    placeholder="Enter recipe details"
                    rows={3}
                    value={foodForm.recipe}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL *</Form.Label>
                  <FormControl
                    name="image"
                    type="text"
                    placeholder="Enter image URL"
                    value={foodForm.image}
                    onChange={handleImageChange}
                    required
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                        }}
                      />
                      <small className="text-muted d-block mt-1">Image Preview</small>
                    </div>
                  )}
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <FormCheck
                    type="switch"
                    id="availabilitySwitch"
                    label="Available"
                    name="isAvailable"
                    checked={foodForm.isAvailable}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFoodModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFoodSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {modalType === 'add' ? 'Adding...' : 'Updating...'}
              </>
            ) : (
              modalType === 'add' ? 'Add Food Item' : 'Update Food Item'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            {viewFood?.name || 'Food Item Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewFood ? (
            <Row>
              <Col md={5}>
                <img
                  src={viewFood.image || 'https://via.placeholder.com/300?text=No+Image'}
                  alt={viewFood.name || 'Food Image'}
                  className="img-fluid mb-3 rounded"
                  style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
              </Col>
              <Col md={7}>
                <h4 className="mb-3">{viewFood.name || 'N/A'}</h4>
                <p><strong>Price:</strong> ₹{viewFood.price ? viewFood.price.toFixed(2) : 'N/A'}</p>
                <p><strong>Description:</strong> {viewFood.description || 'No description'}</p>
                <p><strong>Recipe:</strong> {viewFood.recipe || 'No recipe provided'}</p>
                <p>
                  <strong>Status:</strong>
                  <Badge bg={viewFood.isAvailable ? 'success' : 'danger'} className="ms-2">
                    {viewFood.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </p>
                <p><strong>Added by:</strong> {viewFood.createdBy?.username || 'Unknown'}</p>
                <p><strong>Created At:</strong> {viewFood.createdAt ? new Date(viewFood.createdAt).toLocaleString() : 'N/A'}</p>
              </Col>
            </Row>
          ) : (
            <p>No details available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this food item? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestaurantManager;