import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Modal, Carousel, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';
import axios from 'axios';

const Customerroom = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/rooms/available');
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetails(true);
  };

  const handleBookNow = () => {
    alert(`Booking ${selectedRoom.roomNumber || selectedRoom.name}`);
    setShowDetails(false);
  };

  if (loading) {
    return (
      <>
        <CustHeader />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  return (
    <>
      <CustHeader />
      <br /><br />
      <Container
        className="py-4"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519449556851-5720b33024e7)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          height: '100%',
          maxWidth: '100%',
          margin: 0,
          padding: '0 15px',
          position: 'relative',
          color: '#fff',
        }}
      >
        {/* Overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
        {/* Content with higher z-index */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="text-center mb-4">Available Rooms</h1>
          <p className="text-center mb-4 text-white">
            Explore our comfortable and affordable rooms for your stay. Click on "View Details" to learn more about each room.
          </p>

          {/* <h2 className="text-center mb-4">Our Rooms</h2> */}

          {/* Rooms Grid */}
          <Row xs={1} md={2} lg={3} className="g-4">
            {rooms.length > 0 ? (
              rooms.map(room => (
                <Col key={room.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={room.imageUrl || 'https://via.placeholder.com/400x300?text=Room+Image'} 
                      alt={room.roomNumber || room.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>Room {room.roomNumber || room.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        ₹{room.price.toFixed(2)} per day
                      </Card.Subtitle>
                      <Card.Text className="flex-grow-1">
                        {room.roomType || 'Comfortable room'}
                      </Card.Text>
                      <div className="mt-auto">
                        <Badge bg="info" className="me-2">{room.acType || 'Standard'}</Badge>
                        <div className="d-grid gap-2 mt-3">
                          <Button 
                            variant="outline-primary"
                            onClick={() => handleViewDetails(room)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <h4>No rooms available</h4>
              </Col>
            )}
          </Row>

          {/* Room Details Modal */}
          {selectedRoom && (
            <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
              <Modal.Header>
                <Modal.Title>Room {selectedRoom.roomNumber || selectedRoom.name}</Modal.Title>
                <button
                  type="button" 
                  className="btn-close-custom" 
                  onClick={() => setShowDetails(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </Modal.Header>
              <Modal.Body>
                <Carousel className="mb-4">
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src={selectedRoom.imageUrl || 'https://via.placeholder.com/800x400?text=Room+Image'}
                      alt={`Room ${selectedRoom.roomNumber || selectedRoom.name}`}
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                  </Carousel.Item>
                </Carousel>
                
                <h4>₹{selectedRoom.price.toFixed(2)} per day</h4>
                <p><strong>Type:</strong> {selectedRoom.roomType}</p>
                <p><strong>AC Type:</strong> {selectedRoom.acType}</p>
                
                {selectedRoom.description && (
                  <>
                    <h5>Description:</h5>
                    <p>{selectedRoom.description}</p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary"  onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleBookNow}>
                  Book Now
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </Container>
    </>
  );
};

export default Customerroom;