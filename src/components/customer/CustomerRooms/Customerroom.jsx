import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Modal, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';

const Customerroom = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Mock data
  useEffect(() => {
    const mockRooms = [
      {
        id: 1,
        name: 'Deluxe Room',
        description: 'Spacious room with a king-size bed, modern furnishings, and panoramic city views. Perfect for couples or business travelers.',
        price: 199.99,
        type: 'Deluxe',
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
          'https://images.unsplash.com/photo-1566669437685-2f63c1c0f0a4',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
        ],
        amenities: ['Free WiFi', 'Air conditioning', 'Flat-screen TV', 'Mini-bar', 'Safe'],
        capacity: 2,
        size: '35 sqm'
      },
      // Add more rooms as needed...
    ];
    setRooms(mockRooms);
  }, []);

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetails(true);
  };

  const handleBookNow = () => {
    alert(`Booking ${selectedRoom.name}`);
    setShowDetails(false);
  };

  return (
    <>
      <CustHeader />
    <Container
      className="py-4"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1519449556851-5720b33024e7)', // Hotel-themed background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        height: '100%',
        maxWidth: '100%', // Ensure full width
        margin: 0, // Remove default margins
        padding: '0 15px', // Maintain padding for content
        position: 'relative',
        color: '#fff', // White text for contrast
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
          zIndex: 1,
        }}
      />
      {/* Content with higher z-index */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="text-center mb-4">Our Rooms</h2>

        {/* Rooms Grid */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {rooms.map(room => (
            <Col key={room.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={`${room.images[0]}?w=400&h=300&fit=crop`} 
                  alt={room.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{room.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    ${room.price.toFixed(2)} per night
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    {room.description.substring(0, 80)}...
                  </Card.Text>
                  <div className="mt-auto">
                    <Badge bg="info" className="me-2">Capacity: {room.capacity}</Badge>
                    <Badge bg="secondary">{room.size}</Badge>
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
          ))}
        </Row>

        {/* Room Details Modal */}
        {selectedRoom && (
          <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>{selectedRoom.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Carousel className="mb-4">
                {selectedRoom.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={`${image}?w=800&h=400&fit=crop`}
                      alt={`${selectedRoom.name} view ${index + 1}`}
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              
              <h4>${selectedRoom.price.toFixed(2)} per night</h4>
              <p>{selectedRoom.description}</p>
              
              <h5>Room Features:</h5>
              <div className="d-flex flex-wrap mb-3">
                {selectedRoom.amenities.map((amenity, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-2 mb-2">
                    {amenity}
                  </Badge>
                ))}
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Room Size:</strong> {selectedRoom.size}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Capacity:</strong> {selectedRoom.capacity} {selectedRoom.capacity > 1 ? 'persons' : 'person'}</p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetails(false)}>
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