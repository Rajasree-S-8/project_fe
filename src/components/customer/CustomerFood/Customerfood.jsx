import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';
import axios from 'axios';

const Customerfood = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/food/available');
        setFoodItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food items:', error);
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // Extract unique categories from food items
  const categories = ['All', ...new Set(foodItems.map(item => item.category))].filter(Boolean);

  const filteredItems = selectedCategory === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleOrder = () => {
    alert(`Added ${selectedItem.name} to your order`);
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
          backgroundImage: 'url(https://images.unsplash.com/photo-1556911220-bff31c812dba)',
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
          <h1 className="text-center text-white mb-4">Welcome to Our Restaurant</h1>
          <p className="text-center text-white mb-4">
            Explore our delicious menu and order your favorite dishes online.
          </p>

          {/* <h2 className="text-center mb-4">Our Menu</h2> */}
          
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="d-flex justify-content-center mb-4 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                  className="mx-2 mb-2"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Food Items Grid */}
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <Col key={item.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={item.image || 'https://via.placeholder.com/400x300?text=Food+Image'} 
                      alt={item.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        ₹{item.price.toFixed(2)}
                      </Card.Subtitle>
                      <Card.Text className="flex-grow-1">
                        {item.description?.substring(0, 60)}...
                      </Card.Text>
                      <div className="mt-auto">
                        {item.category && (
                          <Badge bg="success" className="mb-2">
                            {item.category}
                          </Badge>
                        )}
                        <div className="d-flex justify-content-between">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            Details
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleOrder(item)}
                          >
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <h4>No food items available</h4>
              </Col>
            )}
          </Row>

          {/* Item Details Modal */}
          {selectedItem && (
            <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
              <Modal.Header>
                <Modal.Title>{selectedItem.name}</Modal.Title>
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
                <img 
                  src={selectedItem.image || 'https://via.placeholder.com/500x300?text=Food+Image'} 
                  alt={selectedItem.name}
                  className="img-fluid rounded mb-3"
                />
                <p>{selectedItem.description}</p>
                {selectedItem.recipe && (
                  <>
                    <h5>Recipe:</h5>
                    <p>{selectedItem.recipe}</p>
                  </>
                )}
                <h4 className="text-primary">₹{selectedItem.price.toFixed(2)}</h4>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleOrder}>
                  Add to Order
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </Container>
    </>
  );
};

export default Customerfood;