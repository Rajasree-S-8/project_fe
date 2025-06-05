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
  const [acFilter, setAcFilter] = useState('all');
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (acFilter !== 'all') {
      filtered = filtered.filter((room) => room.acType === acFilter);
    }

    // Sort rooms by room number
    filtered.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber));

    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [searchTerm, rooms, statusFilter, typeFilter, acFilter]);

  const fetchRooms = async () => {
    const staffId = localStorage.getItem('staffId');
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

      // Mock multiple images for carousel (since API provides single imageUrl)
      const roomsWithImages = data.map(room => ({
        ...room,
        images: [room.imageUrl || 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150']
      }));

      setRooms(roomsWithImages);
      setFilteredRooms(roomsWithImages);
      if (roomsWithImages.length === 0) {
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
      imageUrl: room.images[0] || '',
    });
    setSelectedRoom(room);
    setImagePreview(room.images[0] || '');
    setCurrentImageIndex(0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditForm({ ...editFormData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !selectedRoom.roomId) {
      setError('No room selected for editing.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const staffId = localStorage.getItem('staffId');
    if (!staffId) {
      setError('Please log in to perform this action.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!editFormData.roomNumber || !editFormData.roomType || !editFormData.price) {
      setError('Please fill in all required fields.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    const price = parseFloat(editFormData.price);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price greater than 0.');
      setTimeout(() => setError(''), 3000);
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
          images: [editFormData.imageUrl, 'https://via.placeholder.com/150', 'https://via.placeholder.com/150']
        };
      }

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
      setTimeout(() => setError(''), 3000);
    }
  };

  const nextImage = (roomId) => {
    setRooms(rooms.map(room => {
      if (room.roomId === roomId) {
        const currentIndex = room.images.indexOf(room.images[currentImageIndex]);
        const nextIndex = (currentIndex + 1) % room.images.length;
        setCurrentImageIndex(nextIndex);
        return room;
      }
      return room;
    }));
  };

  const prevImage = (roomId) => {
    setRooms(rooms.map(room => {
      if (room.roomId === roomId) {
        const currentIndex = room.images.indexOf(room.images[currentImageIndex]);
        const prevIndex = (currentIndex - 1 + room.images.length) % room.images.length;
        setCurrentImageIndex(prevIndex);
        return room;
      }
      return room;
    }));
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
      <div className="view-rooms-content">
        <div className="title-container">
          <h1 className="view-rooms-title">My Rooms</h1>
          <p className="view-rooms-subtitle">View and manage your added rooms</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <svg className="alert-icon" viewBox="0 0 20 20" fill="black">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
            <button className="alert-close" onClick={() => setSuccess('')}>
              <svg className="close-icon" viewBox="0 0 14 14" fill="none">
                <path
                  d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <svg className="alert-icon" viewBox="0 0 20 20" fill="black">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
            <button className="alert-close" onClick={() => setError('')}>
              <svg className="close-icon" viewBox="0 0 14 14" fill="none">
                <path
                  d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search by room number, type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Executive">Executive</option>
            <option value="Presidential">Presidential</option>
          </select>
          <select
            className="filter-select"
            value={acFilter}
            onChange={(e) => setAcFilter(e.target.value)}
          >
            <option value="all">All AC Types</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>
        </div>

        <div className="room-grid">
          {currentRooms.length > 0 ? (
            currentRooms.map((room) => (
              <div key={room.roomId} className="room-card">
                <div className="room-image-container">
                  <div className="carousel">
                    <img
                      src={room.images[currentImageIndex]}
                      alt={`${room.roomNumber}`}
                      className="carousel-image"
                    />
                    <button 
                      className="carousel-button prev"
                      onClick={() => prevImage(room.roomId)}
                    >
                      &lt;
                    </button>
                    <button 
                      className="carousel-button next"
                      onClick={() => nextImage(room.roomId)}
                    >
                      &gt;
                    </button>
                  </div>
                  <span className="availability-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={room.isAvailable ? '#28a745' : '#dc3545'}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d={room.isAvailable
                          ? 'M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z'
                          : 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z'}
                      />
                    </svg>
                  </span>
                </div>
                <div className="room-details">
                  <h3>Room {room.roomNumber}</h3>
                  <p><strong>Type:</strong> {room.roomType}</p>
                  <p><strong>Price:</strong> ₹{room.price.toFixed(2)}</p>
                  <p><strong>AC:</strong> {room.acType}</p>
                  <p><strong>Status:</strong> {room.isAvailable ? 'Available' : 'Unavailable'}</p>
                  <p><strong>Created By:</strong> You</p>
                </div>
                <div className="room-actions">
                  <button className="btn btn-edit" onClick={() => handleEdit(room)}>
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(room.roomId)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-rooms">No rooms match your criteria.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}

        {isEditing && selectedRoom && (
          <div className="edit-modal">
            <div className="edit-modal-content">
              <h2>Edit Room</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Room Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.roomNumber}
                      onChange={(e) =>
                        setEditForm({ ...editFormData, roomNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Type</label>
                    <select
                      className="form-control"
                      value={editFormData.roomType}
                      onChange={(e) =>
                        setEditForm({ ...editFormData, roomType: e.target.value })
                      }
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
                    <label>Price (₹)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={editFormData.price}
                        onChange={(e) =>
                          setEditForm({ ...editFormData, price: e.target.value })
                        }
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>AC Type</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          value="AC"
                          checked={editFormData.acType === 'AC'}
                          onChange={(e) =>
                            setEditForm({ ...editFormData, acType: e.target.value })
                          }
                        />
                        AC Room
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="Non-AC"
                          checked={editFormData.acType === 'Non-AC'}
                          onChange={(e) =>
                            setEditForm({ ...editFormData, acType: e.target.value })
                          }
                        />
                        Non-AC Room
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editFormData.isAvailable}
                      onChange={(e) =>
                        setEditForm({
                          ...editFormData,
                          isAvailable: e.target.checked,
                        })
                      }
                    />
                    Available
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRooms;