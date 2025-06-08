import { Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustHeader from '../header/CustHeader';

const Customerhome = ({ customerName }) => {
    const navigate = useNavigate();
  return (
    <>
      <CustHeader/>

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
              <Button variant="primary" size="lg" className="m-2" onClick={() => navigate('/custroom')}>
                Explore Hotel
              </Button>
              <Button variant="success" size="lg" className="m-2" onClick={() => navigate('/custfood')}>
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