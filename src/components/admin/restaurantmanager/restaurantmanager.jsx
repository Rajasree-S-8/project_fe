
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Pagination, Dropdown, Badge, Spinner, Alert, Modal, Button, FormControl, FormCheck } from 'react-bootstrap';
import './RestaurantManager.css';

const RestaurantManager = ({ isActive }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFood, setEditFood] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    recipe: '',
    isAvailable: true
  });
  const [imagePreview, setImagePreview] = useState('');
  
  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewFood, setViewFood] = useState(null);

  const restaurantManager = JSON.parse(localStorage.getItem('restaurantManager'));

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!restaurantManager?.staffId) {
        setError('Please log in to view food items');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/food/', {
          headers: { staffId: restaurantManager.staffId }
        });
        setFoodItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch food items');
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, []);

  // Filter and search logic
  const filteredItems = foodItems.filter(item => {
    const matchesSearch = 
      (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
      (item.staff?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && item.isAvailable) || 
      (availabilityFilter === 'unavailable' && !item.isAvailable);
    return matchesSearch && matchesAvailability;
  });

  // Sorting logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue, bValue;
    if (sortConfig.key === 'staff.username') {
      aValue = a.staff?.username || '';
      bValue = b.staff?.username || '';
    } else {
      aValue = a[sortConfig.key] ?? '';
      bValue = b[sortConfig.key] ?? '';
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
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
    if (!restaurantManager?.staffId) {
      setError('Please log in to refresh food items');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/food/', {
        headers: { staffId: restaurantManager.staffId }
      });
      setFoodItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh food items');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id) => {
    if (!restaurantManager?.staffId) {
      setError('Please log in to modify food items');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/food/${id}/availability`, {}, {
        headers: { staffId: restaurantManager.staffId }
      });
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle availability');
    }
  };

  const handleEdit = async (id) => {
    if (!restaurantManager?.staffId) {
      setError('Please log in to edit food items');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/food/${id}`, {
        headers: { staffId: restaurantManager.staffId }
      });
      const food = response.data;
      setEditFood(food);
      setEditForm({
        name: food.name || '',
        price: food.price ? food.price.toString() : '',
        image: food.image || '',
        description: food.description || '',
        recipe: food.recipe || '',
        isAvailable: food.isAvailable ?? true
      });
      setImagePreview(food.image || '');
      setShowEditModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch food item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFood = async () => {
    if (!restaurantManager?.staffId) {
      setError('Please log in to update food items');
      return;
    }

    if (!editForm.name || !editForm.price || !editForm.image || !editForm.description) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const updatedFood = {
        name: editForm.name,
        price: parseFloat(editForm.price),
        image: editForm.image,
        description: editForm.description,
        recipe: editForm.recipe,
        isAvailable: editForm.isAvailable
      };
      await axios.put(`http://localhost:8080/api/food/${editFood.foodId}`, updatedFood, {
        headers: { staffId: restaurantManager.staffId }
      });
      setShowEditModal(false);
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update food item');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    if (!restaurantManager?.staffId) {
      setError('Please log in to view food items');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/food/${id}`, {
        headers: { staffId: restaurantManager.staffId }
      });
      setViewFood(response.data);
      setShowViewModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch food item details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setEditForm({ ...editForm, image: url });
    setImagePreview(url);
  };

  if (!isActive) return null;

  return (
    
    
    <div className="container mt-4 restaurant-manager">
      <h1 className="h3 fw-bold mb-1">Hotel Manager</h1>
      <p className="text-muted mb-4">Manage Hotel Rooms</p>
      <div className="card shadow">
        
        
        <div className="card-body">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          <div className="row mb-4">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Search Foods</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by food name or staff username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </div>
            
            <div className="col-md-3">
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
            </div>
            
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-primary w-100"
                onClick={refreshData}
                disabled={loading || !restaurantManager?.staffId}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh Data'
                )}
              </button>
            </div>
          </div>

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
                      <th 
                        onClick={() => requestSort('name')}
                        style={{ cursor: 'pointer' }}
                      >
                        Food Name {sortConfig.key === 'name' && (
                          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th>Image</th>
                      <th 
                        onClick={() => requestSort('price')}
                        style={{ cursor: 'pointer' }}
                      >
                        Price {sortConfig.key === 'price' && (
                          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th>Description</th>
                      <th 
                        onClick={() => requestSort('staff.username')}
                        style={{ cursor: 'pointer' }}
                      >
                        Added By {sortConfig.key === 'staff.username' && (
                          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th 
                        onClick={() => requestSort('isAvailable')}
                        style={{ cursor: 'pointer' }}
                      >
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
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                objectFit: 'cover',
                                borderRadius: '5px'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                              }}
                            />
                          </td>
                          <td>₹{item.price ? item.price.toFixed(2) : 'N/A'}</td>
                          <td style={{ maxWidth: '250px' }}>
                            <div className="text-truncate" title={item.description}>
                              {item.description || 'No description'}
                            </div>
                          </td>
                          <td>
                            {item.staff ? (
                              <Badge bg="info" className="p-2">
                                <i className="bi bi-person-fill me-2"></i>
                                {item.staff.username || 'Unknown'}
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="p-2">
                                N/A
                              </Badge>
                            )}
                          </td>
                          <td>
                            <Badge bg={item.isAvailable ? 'success' : 'danger'} className="p-2">
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleEdit(item.foodId)}
                                disabled={!restaurantManager?.staffId}
                              >
                                <i className="bi bi-pencil me-1"></i> Edit
                              </Button>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleView(item.foodId)}
                                disabled={!restaurantManager?.staffId}
                              >
                                <i className="bi bi-eye me-1"></i> View
                              </Button>
                              <Button
                                variant={item.isAvailable ? 'warning' : 'success'}
                                size="sm"
                                onClick={() => toggleAvailability(item.foodId, item.isAvailable)}
                                disabled={!restaurantManager?.staffId}
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
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
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
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            Edit {editFood?.name || 'Food Item'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Food Name *</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter food name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <FormControl
                type="number"
                placeholder="Enter price"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL *</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter image URL"
                value={editForm.image}
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
              <Form.Label>Description *</Form.Label>
              <FormControl
                as="textarea"
                placeholder="Enter food description"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recipe</Form.Label>
              <FormControl
                as="textarea"
                placeholder="Enter recipe details"
                rows={3}
                value={editForm.recipe}
                onChange={(e) => setEditForm({ ...editForm, recipe: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <FormCheck
                type="switch"
                id="availabilitySwitch"
                label="Available"
                checked={editForm.isAvailable}
                onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateFood}
            disabled={loading || !restaurantManager?.staffId}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Food Item'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            View {viewFood?.name || 'Food Item'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewFood ? (
            <div>
              <img
                src={viewFood.image || 'https://via.placeholder.com/300?text=No+Image'}
                alt={viewFood.name || 'Food Image'}
                className="img-fluid mb-3"
                style={{ maxHeight: '300px', width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                }}
              />
              <p><strong>Name:</strong> {viewFood.name || 'N/A'}</p>
              <p><strong>Price:</strong> ₹{viewFood.price ? viewFood.price.toFixed(2) : 'N/A'}</p>
              <p><strong>Description:</strong> {viewFood.description || 'No description'}</p>
              <p><strong>Recipe:</strong> {viewFood.recipe || 'No recipe provided'}</p>
              <p><strong>Status:</strong> {viewFood.isAvailable ? 'Available' : 'Unavailable'}</p>
              <p><strong>Added By:</strong> {viewFood.staff?.username || 'Unknown'}</p>
              <p><strong>Created At:</strong> {viewFood.createdAt || 'N/A'}</p>
            </div>
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
    </div>
  );
};

export default RestaurantManager;
