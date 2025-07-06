import React, { useState, useEffect } from 'react';
import './hotelmanager.css';

const HotelManager = ({ isActive }) => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    roomNumber: '',
    roomType: '',
    price: '',
    acType: 'AC',
    isAvailable: true,
    imageUrl: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8;
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (isActive) {
      fetchRooms();
    }
  }, [isActive]);

  useEffect(() => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.createdBy?.username && room.createdBy.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((room) =>
        statusFilter === 'available' ? room.isAvailable : !room.isAvailable
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((room) => room.roomType === typeFilter);
    }

    filtered.sort((a, b) => {
      const roomNumberA = parseInt(a.roomNumber, 10);
      const roomNumberB = parseInt(b.roomNumber, 10);
      return roomNumberA - roomNumberB;
    });

    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [searchTerm, rooms, statusFilter, typeFilter]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/all-rooms`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.statusText}`);
      }

      const data = await response.json();
      setRooms(data);
      if (data.length === 0) {
        setError('No rooms found in the system.');
      }
    } catch (err) {
      console.error('Fetch rooms error:', err.message);
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Access': 'true', // Added admin access header
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to delete room: ${errorData || response.statusText}`);
      }

      setRooms(rooms.filter((room) => room.roomId !== id));
      if (selectedRoom && selectedRoom.roomId === id) {
        setSelectedRoom(null);
      }
    } catch (err) {
      console.error('Delete room error:', err);
      setError(err.message);
    }
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setSelectedRoom(room);
    setEditForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price.toString(),
      acType: room.acType,
      isAvailable: room.isAvailable,
      imageUrl: room.imageUrl || '',
    });
  };

  const handleView = (room) => {
    setIsEditing(false);
    setSelectedRoom(room);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !selectedRoom.roomId) {
      setError('No room selected for editing.');
      return;
    }

    const price = parseFloat(editForm.price);
    if (isNaN(price) || price < 0) {
      setError('Please enter a valid price.');
      return;
    }

    if (!editForm.roomNumber || !editForm.roomType || !editForm.price) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/update/${selectedRoom.roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Access': 'true', // Added admin access header
        },
        body: JSON.stringify({
          roomNumber: editForm.roomNumber,
          roomType: editForm.roomType,
          price,
          acType: editForm.acType,
          isAvailable: editForm.isAvailable,
          imageUrl: editForm.imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update room: ${errorData || response.statusText}`);
      }

      const updatedRoom = await response.json();
      setRooms(rooms.map((room) => (room.roomId === updatedRoom.roomId ? updatedRoom : room)));
      setIsEditing(false);
      setSelectedRoom(updatedRoom);
    } catch (err) {
      console.error('Update room error:', err);
      setError(err.message);
    }
  };

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="hotel-manager" className={`mt-5 ${!isActive ? 'd-none' : ''}`}>
      <h1 className="h3 fw-bold mb-1">Hotel Manager</h1>
      <p className="text-muted mb-4">Manage Hotel Rooms</p>
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="spinner-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="error-message alert alert-danger">{error}</div>
          ) : (
            <>
              <div className="filters-container mb-4">
                <select
                  className="form-select me-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
                <select
                  className="form-select me-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search rooms or staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {currentRooms.length === 0 ? (
                <div className="no-rooms-message alert alert-info">
                  No rooms found matching your criteria.
                </div>
                
              ) : (
                <>
                  <div className="rooms-grid">
                    {currentRooms.map((room) => (
                      <div key={room.roomId} className="room-card card shadow-sm">
                        <div className="room-image-container">
                          {room.imageUrl ? (
                            <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} className="card-img-top" />
                          ) : (
                            <div className="no-image card-img-top">No Image</div>
                          )}
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">Room {room.roomNumber}</h5>
                          <p className="card-text">Type: {room.roomType}</p>
                          <p className="card-text">Price: ₹{room.price.toFixed(2)}</p>
                          <p className="card-text">Added by: {room.createdBy?.username || 'Unknown'}</p>
                          <p className="card-text">
                            Status:
                            <span className={`status-badge ${room.isAvailable ? 'badge bg-success' : 'badge bg-danger'}`}>
                              {room.isAvailable ? 'Available' : 'Booked'}
                            </span>
                          </p>
                          <div className="room-actions d-flex gap-2">
                            <button className="btn btn-primary btn-sm" onClick={() => handleView(room)}>View</button>
                            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(room)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(room.roomId)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  

                  {filteredRooms.length > roomsPerPage && (
                    <nav className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => paginate(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {selectedRoom && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Room' : `Room ${selectedRoom.roomNumber}`}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRoom(null)}></button>
              </div>
              <div className="modal-body">
                {isEditing ? (
                  <div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Room Number</label>
                        <input
                          className="form-control"
                          value={editForm.roomNumber}
                          onChange={(e) => setEditForm({ ...editForm, roomNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Room Type</label>
                        <select
                          className="form-select"
                          value={editForm.roomType}
                          onChange={(e) => setEditForm({ ...editForm, roomType: e.target.value })}
                          required
                        >
                          <option value="">Select room type</option>
                          <option value="Single">Single</option>
                          <option value="Double">Double</option>
                          <option value="Suite">Suite</option>
                          <option value="Deluxe">Deluxe</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">AC Type</label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="acType"
                              value="AC"
                              checked={editForm.acType === 'AC'}
                              onChange={(e) => setEditForm({ ...editForm, acType: e.target.value })}
                            />
                            <label className="form-check-label">AC</label>
                          </div>
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="acType"
                              value="Non-AC"
                              checked={editForm.acType === 'Non-AC'}
                              onChange={(e) => setEditForm({ ...editForm, acType: e.target.value })}
                            />
                            <label className="form-check-label">Non-AC</label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={editForm.imageUrl}
                          onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                          placeholder="Enter image URL"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Image Preview</label>
                        <div className="image-preview-container">
                          {editForm.imageUrl ? (
                            <img src={editForm.imageUrl} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '100px' }} />
                          ) : (
                            <div className="no-image">No Image Preview</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={editForm.isAvailable}
                            onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                          />
                          <label className="form-check-label">Available</label>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Save</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="added-by">Added by: {selectedRoom.createdBy?.username || 'Unknown'}</p>
                    <div className="modal-image-container mb-3">
                      {selectedRoom.imageUrl ?  (
                        <img src={selectedRoom.imageUrl} alt={`Room ${selectedRoom.roomNumber}`} className="img-fluid rounded" />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <p><strong>Type:</strong> {selectedRoom.roomType}</p>
                    <p><strong>Price:</strong> ₹{selectedRoom.price.toFixed(2)}</p>
                    <p><strong>AC Type:</strong> {selectedRoom.acType}</p>
                    <p>
                      <strong>Status:</strong>
                      <span className={`status-badge ${selectedRoom.isAvailable ? 'badge bg-success' : 'badge bg-danger'} ms-2`}>
                        {selectedRoom.isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </p>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-warning" onClick={() => handleEdit(selectedRoom)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(selectedRoom.roomId)}>Delete</button>
                      <button className="btn btn-secondary" onClick={() => setSelectedRoom(null)}>Close</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManager;