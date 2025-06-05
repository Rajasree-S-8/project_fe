import { useState, useEffect } from 'react';
import './viewroom.css';

const ViewRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditForm] = useState({
    roomNumber: '',
    roomType: '',
    price: '',
    acType: 'AC',
    isAvailable: true,
    imageUrl: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.createdBy?.username &&
          room.createdBy.username.toLowerCase().includes(searchTerm.toLowerCase()))
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

    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [searchTerm, rooms, statusFilter, typeFilter]);

  const fetchRooms = async () => {
    const staffId = localStorage.getItem('staffId');
    console.log('Fetching rooms for staffId:', staffId);
    if (!staffId) {
      setError('Please log in to access your rooms.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/my-rooms`, {
        headers: {
          'X-Staff-Id': staffId,
        },
      });
      console.log('Fetch response:', { status: response.status, statusText: response.statusText });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch rooms: ${typeof data === 'string' ? data : JSON.stringify(data)} (Status: ${response.status})`
        );
      }

      console.log('Fetched rooms:', data);
      setRooms(data);
      setFilteredRooms(data);
      if (data.length === 0) {
        setError('No rooms found for your account.');
      }
    } catch (err) {
      console.error('Fetch rooms error:', err.message);
      setError(err.message || 'Unable to connect to the server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const staffId = localStorage.getItem('staffId');
      if (!staffId) throw new Error('Please log in to perform this action.');

      const response = await fetch(`http://localhost:8080/api/rooms/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Staff-Id': staffId,
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
      setSuccess('Room deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete room error:', err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setEditForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price.toString(),
      acType: room.acType,
      isAvailable: room.isAvailable,
      imageUrl: room.imageUrl || '',
    });
    setSelectedRoom(room);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !selectedRoom.roomId) {
      setError('No room selected for editing.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const staffId = localStorage.getItem('staffId');
    if (!staffId) {
      setError('Please log in to perform this action.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (!editFormData.roomNumber || !editFormData.roomType || !editFormData.price) {
      setError('Please fill in all required fields.');
      setTimeout(() => setError(''), 5000);
      return;
    }
    const price = parseFloat(editFormData.price);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price greater than 0.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/update/${selectedRoom.roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Staff-Id': staffId,
        },
        body: JSON.stringify({
          roomNumber: editFormData.roomNumber,
          roomType: editFormData.roomType,
          price,
          acType: editFormData.acType,
          isAvailable: editFormData.isAvailable,
          imageUrl: editFormData.imageUrl || null,
        }),
      });

      const contentType = response.headers.get('content-type');
      let updatedRoom;
      if (contentType && contentType.includes('application/json')) {
        updatedRoom = await response.json();
      } else {
        const errorData = await response.text();
        if (!response.ok) {
          throw new Error(`Failed to update room: ${errorData || response.statusText}`);
        }
        updatedRoom = {
          ...selectedRoom,
          roomNumber: editFormData.roomNumber,
          roomType: editFormData.roomType,
          price,
          acType: editFormData.acType,
          isAvailable: editFormData.isAvailable,
          imageUrl: editFormData.imageUrl,
        };
      }

      console.log('Update response:', { status: response.status, updatedRoom });

      if (!response.ok) {
        throw new Error(`Failed to update room: ${JSON.stringify(updatedRoom) || response.statusText}`);
      }

      setRooms(rooms.map((room) => (room.roomId === updatedRoom.roomId ? updatedRoom : room)));
      setIsEditing(false);
      setSelectedRoom(updatedRoom);
      setSuccess('Room updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update room error:', err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="view-rooms-container">
      <h1 className="view-rooms-title">My Rooms</h1>
      <p className="view-rooms-subtitle">View and manage your added rooms</p>

      {success && (
        <div className="alert alert-success">
          <svg
            className="alert-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
          <button
            className="alert-close"
            onClick={() => setSuccess('')}
          >
            <svg className="close-icon" viewBox="0 0 14 14" fill="none">
              <path
                d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <svg
            className="alert-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
          <button
            className="alert-close"
            onClick={() => setError('')}
          >
            <svg className="close-icon" viewBox="0 0 14 14" fill="none">
              <path
                d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="filters-container">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
          <option value="Executive">Executive</option>
          <option value="Presidential">Presidential</option>
        </select>
        <input
          type="text"
          className="filter-input"
          placeholder="Search rooms or staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {currentRooms.length === 0 ? (
        <div className="no-rooms-message">
          No rooms found. Please add rooms from the Add Room page.
        </div>
      ) : (
        <div className="rooms-grid">
          {currentRooms.map((room) => (
            <div key={room.roomId} className="room-card">
              <div className="room-image-container">
                {room.imageUrl ? (
                  <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="room-details">
                <h3>Room {room.roomNumber}</h3>
                <p>Type: {room.roomType}</p>
                <p>Price: ₹{room.price.toFixed(2)}</p>
                <p>Added by: {room.createdBy?.username || 'Unknown'}</p>
                <p>
                  Status:
                  <span className={`status-badge ${room.isAvailable ? 'available' : 'booked'}`}>
                    {room.isAvailable ? 'Available' : 'Booked'}
                  </span>
                </p>
                <div className="room-actions">
                  <button className="action-btn view-btn" onClick={() => setSelectedRoom(room)}>View</button>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(room)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(room.roomId)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRooms.length > roomsPerPage && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedRoom(null)}>
              ×
            </button>
            {isEditing ? (
              <form className="edit-form" onSubmit={handleEditSubmit}>
                <h2 className="form-title">Edit Room</h2>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                        fill="#495057"
                      />
                      <path d="M13 7H11V13H17V11H13V7Z" fill="#495057" />
                    </svg>
                    Room Number *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.roomNumber}
                    onChange={(e) => setEditForm({ ...editFormData, roomNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17 11V3H7V7H3V21H11V17H13V21H21V11H17ZM7 19H5V17H7V19ZM7 15H5V13H7V15ZM7 11H5V9H7V11ZM11 15H9V13H11V15ZM11 11H9V9H11V11ZM11 7H9V5H11V7ZM15 15H13V13H15V15ZM15 11H13V9H15V11ZM15 7H13V5H15V7ZM19 19H17V17H19V19ZM19 15H17V13H19V15Z"
                        fill="#495057"
                      />
                    </svg>
                    Room Type *
                  </label>
                  <select
                    className="form-select"
                    value={editFormData.roomType}
                    onChange={(e) => setEditForm({ ...editFormData, roomType: e.target.value })}
                    required
                  >
                    <option value="">Select room type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive">Executive</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 4C7.31 4 3.5 7.31 3.5 12C3.5 16.69 7.31 20 12 20C16.69 20 20.5 16.69 20.5 12C20.5 7.31 16.69 4 12 4ZM12 18C8.42 18 5.5 15.08 5.5 12C5.5 8.92 8.42 6 12 6C15.58 6 18.5 8.92 18.5 12C18.5 15.08 15.58 18 12 18Z"
                        fill="#495057"
                      />
                      <path d="M19 14H5V12H19V14Z" fill="#495057" />
                    </svg>
                    AC Type *
                  </label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="acType"
                        value="AC"
                        checked={editFormData.acType === 'AC'}
                        onChange={(e) => setEditForm({ ...editFormData, acType: e.target.value })}
                        required
                      />
                      AC Room
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="acType"
                        value="Non-AC"
                        checked={editFormData.acType === 'Non-AC'}
                        onChange={(e) => setEditForm({ ...editFormData, acType: e.target.value })}
                      />
                      Non-AC Room
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                        fill="#495057"
                      />
                      <path
                        d="M12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10ZM12 12C13.1 12 14 12.9 14 14C14 15.1 13.1 16 12 16C10.9 16 10 15.1 10 14C10 12.9 10.9 12 12 12Z"
                        fill="#495057"
                      />
                    </svg>
                    Price per day *
                  </label>
                  <div className="input-group">
                    <span className="input-group-prefix">
                      <svg className="currency-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                      </svg>
                    </span>
                    <input
                      type="number"
                      className="form-input"
                      value={editFormData.price}
                      onChange={(e) => setEditForm({ ...editFormData, price: e.target.value })}
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="form-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
                        fill="#495057"
                      />
                      <path d="M14.14 11.86L11.14 15.73L9 13.14L6 17H18L14.14 11.86Z" fill="#495057" />
                    </svg>
                    Room Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    value={editFormData.imageUrl}
                    onChange={(e) => setEditForm({ ...editFormData, imageUrl: e.target.value })}
                    placeholder="https://example.com/room-image.jpg"
                  />
                  {editFormData.imageUrl && (
                    <div className="image-preview">
                      <img
                        src={editFormData.imageUrl}
                        alt="Room preview"
                        className="preview-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="preview-text">
                        <svg className="preview-icon" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                            fill="#6c757d"
                          />
                          <path
                            d="M11 16H13V11H11V16ZM12 9C12.55 9 13 8.55 13 8C13 7.45 12.55 7 12 7C11.45 7 11 7.45 11 8C11 8.55 11.45 9 12 9Z"
                            fill="#6c757d"
                          />
                        </svg>
                        Image preview
                      </span>
                    </div>
                  )}
                </div>
                <div className="form-group form-switch">
                  <input
                    type="checkbox"
                    className="switch-input"
                    id="editIsAvailable"
                    checked={editFormData.isAvailable}
                    onChange={(e) => setEditForm({ ...editFormData, isAvailable: e.target.checked })}
                  />
                  <label className="switch-label">
                    <svg className="form-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill={editFormData.isAvailable ? '#198754' : '#6c757d'}
                      />
                    </svg>
                    {editFormData.isAvailable ? 'Available' : 'Unavailable'}
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="action-btn save-btn">Save</button>
                  <button
                    type="button"
                    className="action-btn cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="room-details-modal">
                <h2 className="modal-title">Room {selectedRoom.roomNumber}</h2>
                <p className="added-by">Added by: {selectedRoom.createdBy?.username || 'Unknown'}</p>
                <div className="modal-image-container">
                  {selectedRoom.imageUrl ? (
                    <img src={selectedRoom.imageUrl} alt={`Room ${selectedRoom.roomNumber}`} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="modal-details">
                  <p><strong>Type:</strong> {selectedRoom.roomType}</p>
                  <p><strong>Price:</strong> ₹{selectedRoom.price.toFixed(2)}</p>
                  <p><strong>AC Type:</strong> {selectedRoom.acType}</p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`status-badge ${selectedRoom.isAvailable ? 'available' : 'booked'}`}>
                      {selectedRoom.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </p>
                </div>
                <div className="modal-actions">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(selectedRoom)}>
                    Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(selectedRoom.roomId)}>
                    Delete
                  </button>
                  <button className="action-btn close-btn" onClick={() => setSelectedRoom(null)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRooms;