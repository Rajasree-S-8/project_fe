import React from "react";
import { NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePage() {

    const navigate = useNavigate();

    return (
        <div className="homepage">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#">
                        <span className="text-warning">Gourmet</span>Bite
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link active" href="#">
                                    Home
                                </a>
                            </li>
                            <NavDropdown title="Menu" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1" onClick={()=>{navigate("/addfood")}}>Add Food</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2" onClick={()=>{navigate("/viewfood")}}>View Food</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3" onClick={()=>{navigate("/vieworders")}}>View Orders</NavDropdown.Item>
                            </NavDropdown>
                            <li className="nav-item">
                                <a className="nav-link" href="#about">
                                    About
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Background Image */}
            <header className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content text-center text-white">
                    <h1 className="display-3 fw-bold mb-3">Welcome to <span className="text-warning">Gourmet</span>Bite</h1>
                    <p className="lead fs-4 mb-4">Where every bite tells a delicious story</p>
                </div>
            </header>

            {/* About Section */}
            <section id="about" className="py-5 bg-dark text-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <img
                                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                                alt="Restaurant interior"
                                className="img-fluid rounded shadow"
                            />
                        </div>
                        <div className="col-lg-6">
                            <h2 className="fw-bold display-6 mb-4">Our <span className="text-warning">Story</span></h2>
                            <p className="lead">
                                Founded in 2010, GourmetBite has been serving exceptional cuisine in a warm and inviting atmosphere.
                            </p>
                            <p>
                                Our philosophy is simple: source the finest ingredients, prepare them with skill and passion,
                                and serve them with genuine hospitality. Chef Marco and his team create dishes that celebrate
                                both tradition and innovation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <h3 className="fw-bold mb-4"><span className="text-warning">Gourmet</span>Bite</h3>
                            <p>Elevating dining experiences through exceptional cuisine, warm hospitality, and unforgettable flavors.</p>
                            <div className="social-icons mt-4">
                                <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-tiktok"></i></a>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <h5 className="fw-bold mb-4">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Home</a></li>
                                <li className="mb-2"><a href="#menu" className="text-white text-decoration-none">Menu</a></li>
                                <li className="mb-2"><a href="#about" className="text-white text-decoration-none">About</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-4">
                            <h5 className="fw-bold mb-4">Opening Hours</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">Monday - Friday: 11am - 10pm</li>
                                <li className="mb-2">Saturday: 10am - 11pm</li>
                                <li>Sunday: 10am - 9pm</li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="text-center">
                        <p className="mb-0">© {new Date().getFullYear()} GourmetBite. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Add Font Awesome for icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

            {/* Custom CSS */}
            <style>{`
         .navbar-nav .dropdown-menu {
    background-color: #212529; /* dark background */
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
  }

  .navbar-nav .dropdown-menu .dropdown-item {
    color: #fff;
    padding: 0.75rem 1.25rem;
    transition: background-color 0.2s;
  }

  .navbar-nav .dropdown-menu .dropdown-item:hover {
    background-color: #ffc107;
    color: #212529;
  }

  .navbar-nav .nav-link.dropdown-toggle::after {
    margin-left: 0.35em;
    vertical-align: 0.1em;
  }
      
        .homepage {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                      url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
        }
        
        .navbar {
          transition: all 0.3s;
        }
        
        .navbar.scrolled {
          background-color: rgba(0, 0, 0, 0.9) !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .card {
          transition: transform 0.3s;
        }
        
        .card:hover {
          transform: translateY(-10px);
        }
        
        .section-header h2 {
          position: relative;
          display: inline-block;
        }
        
        .section-header h2:after {
          content: '';
          position: absolute;
          width: 50px;
          height: 3px;
          background-color: #ffc107;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .social-icons a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }
        
        .social-icons a:hover {
          background-color: #ffc107;
          color: #212529 !important;
        }
      `}</style>
        </div>
    );
}

export default HomePage;