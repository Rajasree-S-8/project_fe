
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Container, Pagination, Spinner, Alert } from 'react-bootstrap';
import './food.css';

const FoodOrders = ({ isActive }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 cards per page

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
        const response = await axios.get('http://localhost:8080/api/food/available', {
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(foodItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isActive) return null;

  return (
    <Container className="food-orders mt-5">
      <div className="card shadow mb-5">
       
        <div className="card-body">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading food items...</p>
            </div>
          ) : foodItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-emoji-frown fs-1 text-muted mb-3"></i>
              <h5>No food items available</h5>
              <p className="text-muted">Check back later or add new items.</p>
            </div>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {currentItems.map((item) => (
                  <Col key={item.foodId}>
                    <Card className="h-100 shadow-sm food-card">
                      <Card.Img
                        variant="top"
                        src={item.image || 'https://via.placeholder.com/300?text=No+Image'}
                        alt={item.name || 'Food Image'}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                        }}
                      />
                      <Card.Body>
                        <Card.Title className="text-truncate" title={item.name}>
                          {item.name || 'N/A'}
                        </Card.Title>
                        <Card.Text className="text-primary fw-bold">
                          ₹{item.price ? item.price.toFixed(2) : 'N/A'}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
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
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      }
                      return null;
                    })}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default FoodOrders;
