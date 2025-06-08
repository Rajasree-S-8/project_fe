import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';

const Customerfood = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data
  useEffect(() => {
    const mockFoodItems = [
      {
        id: 1,
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce, served with seasonal vegetables and mashed potatoes. The salmon is cooked to perfection with a crispy skin and tender flesh.',
        price: 24.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
        available: true,
        ingredients: ['Salmon fillet', 'Lemon', 'Butter', 'Fresh herbs', 'Seasonal vegetables'],
        calories: 650
      },
      {
        id: 2,
        name: 'Vegetable Pasta',
        description: 'Penne pasta with seasonal vegetables in a creamy garlic sauce, topped with parmesan cheese. A perfect vegetarian option packed with flavors.',
        price: 18.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',
        available: true,
        ingredients: ['Penne pasta', 'Bell peppers', 'Zucchini', 'Mushrooms', 'Cream sauce'],
        calories: 520
      },
      // Add more items as needed...
    ];
    setFoodItems(mockFoodItems);
  }, []);

  const categories = ['All', 'Main Course', 'Dessert', 'Appetizer'];

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

  return (
    <>
    <CustHeader />
    <Container
      className="py-4"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1556911220-bff31c812dba)', // Restaurant-themed background
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
        <h2 className="text-center mb-4">Our Menu</h2>
        {/* Category Filter */}
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

        {/* Food Items Grid */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredItems.map(item => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={`${item.image}?w=400&h=300&fit=crop`} 
                  alt={item.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    ${item.price.toFixed(2)}
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    {item.description.substring(0, 60)}...
                  </Card.Text>
                  <div className="mt-auto">
                    <Badge bg="success" className="mb-2">
                      {item.category}
                    </Badge>
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
          ))}
        </Row>

        {/* Item Details Modal */}
        {selectedItem && (
          <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{selectedItem.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img 
                src={`${selectedItem.image}?w=500&h=300&fit=crop`} 
                alt={selectedItem.name}
                className="img-fluid rounded mb-3"
              />
              <p>{selectedItem.description}</p>
              <h5>Ingredients:</h5>
              <ul>
                {selectedItem.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <p><strong>Calories:</strong> {selectedItem.calories}</p>
              <h4 className="text-primary">${selectedItem.price.toFixed(2)}</h4>
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