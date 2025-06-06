import React, { useState, useEffect } from 'react';
import './rooms.css'; // Add a separate CSS file for Rooms-specific styling

const Rooms = ({ isActive }) => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(9); // Default to 9 for 3x3 grid
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isActive) {
      fetchRooms();
    }
  }, [isActive]);

  useEffect(() => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort rooms by room number (numeric sort)
    filtered.sort((a, b) => {
      const roomNumberA = parseInt(a.roomNumber, 10);
      const roomNumberB = parseInt(b.roomNumber, 10);
      return roomNumberA - roomNumberB;
    });

    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [searchTerm, rooms]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/rooms/all-rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEntriesChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div id="rooms" className={`mt-5 ${!isActive ? 'd-none' : ''}`}>
      <h1 className="h3 fw-bold mb-1">Rooms</h1>
      <p className="text-muted mb-4">View room details</p>
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
                  <label htmlFor="rooms-entries" className="form-label me-2 text-muted">
                    Entries per page
                  </label>
                  <select
                    id="rooms-entries"
                    className="form-select form-select-sm w-auto"
                    onChange={handleEntriesChange}
                  >
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="27">27</option>
                    <option value="36">36</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search by room number..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {currentItems.length > 0 ? (
                  currentItems.map((room) => (
                    <div key={room.roomId} className="col">
                      <div className="card h-100 shadow-sm">
                        <div className="room-image-container">
                          {room.imageUrl ? (
                            <img
                              src={room.imageUrl}
                              alt={`Room ${room.roomNumber}`}
                              className="card-img-top"
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="no-image card-img-top"
                              style={{
                                height: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f0f0f0',
                              }}
                            >
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="card-body text-center">
                          <h5 className="card-title">Room {room.roomNumber}</h5>
                          <p className="card-text">Price: ₹{room.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-4">
                    No rooms found
                  </div>
                )}
              </div>
              {filteredRooms.length > itemsPerPage && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                          {number}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;