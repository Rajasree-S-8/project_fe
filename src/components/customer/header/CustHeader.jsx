import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustHeader = () => {
    const navigate = useNavigate();
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand>Welcome to Revzz Hotel</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link><Button variant="outline-light" onClick={()=>navigate("/custhome")}>Home</Button></Nav.Link>
              <Nav.Link><Button variant="outline-light" onClick={()=>{navigate("/custroom")}}>Rooms</Button></Nav.Link>
              <Nav.Link><Button variant="outline-light" onClick={()=>{navigate("/custfood")}}>Food</Button></Nav.Link>
              <Nav.Link><Button variant="outline-light">My Bookings</Button></Nav.Link>
              <Nav.Link><Button variant="danger" onClick={()=>navigate("/")}><i className='bi bi-box-arrow-left'>Logout</i></Button></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}
export default CustHeader;