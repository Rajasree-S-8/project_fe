import React from "react";
import Header from "../header/Header.jsx";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      <Header />
      
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content text-center text-white">
          <h1 className="display-3 fw-bold mb-3">Welcome to <span className="text-warning">Revzz</span> Hotel</h1>
          <p className="lead fs-4 mb-4">Restaurant Manager</p>
        </div>
      </header>

      <section id="about" className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Restaurant interior"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold display-6 mb-4">Our <span className="text-warning">Story</span></h2>
              <p className="lead">
                Founded in 2010, Revzz Hotel has been serving exceptional cuisine in a warm and inviting atmosphere.
              </p>
              <p>
                Our philosophy is simple: source the finest ingredients, prepare them with skill and passion,
                and serve them with genuine hospitality. Our team creates dishes that celebrate
                both tradition and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h3 className="fw-bold mb-4"><span className="text-warning">Revzz</span> Hotel</h3>
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
            <p className="mb-0">© {new Date().getFullYear()} Revzz Hotel. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    </div>
  );
}

export default HomePage;