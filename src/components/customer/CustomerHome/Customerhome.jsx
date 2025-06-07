import React from 'react';
import { Navbar, Nav, Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Customerhome = ({ customerName }) => {
    const navigate = useNavigate();
  return (
    <>
      {/* Navigation Bar (unchanged) */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand>Welcome {customerName}, to Revzz Hotel</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link><Button variant="outline-light" onClick={()=>navigate("/custhome")}>Home</Button></Nav.Link>
              <Nav.Link><Button variant="outline-light">Rooms</Button></Nav.Link>
              <Nav.Link><Button variant="outline-light">Food</Button></Nav.Link>
              <Nav.Link><Button variant="outline-light">My Bookings</Button></Nav.Link>
              <Nav.Link><Button variant="danger" onClick={()=>navigate("/")}><i className='bi bi-box-arrow-left'>Logout</i></Button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section - Replaces Jumbotron */}
      <div 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945)',
          backgroundSize: 'cover',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Container>
          <Card bg="transparent" border="none">
            <Card.Body>
              <Card.Title as="h1" style={{ textShadow: '2px 2px 4px #000000' }}>
                Experience Luxury
              </Card.Title>
              <Button variant="primary" size="lg" className="m-2">
                Explore Hotel
              </Button>
              <Button variant="success" size="lg" className="m-2">
                Explore Restaurant
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default Customerhome;