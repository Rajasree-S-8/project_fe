import React from "react";
import { useNavigate } from "react-router-dom";
import './css/Home.css'

function HomePage() {
    
    

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
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="menuDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Menu
                </a>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="menuDropdown">
                  <li><a className="dropdown-item" href="#add-food"onClick={()=>{navigate("/add-food")}}>Add Food</a></li>
                  <li><a className="dropdown-item" href="#view-food">View Food</a></li>
                  <li><a className="dropdown-item" href="#view-orders">View Orders</a></li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
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
          <div className="d-flex justify-content-center gap-3">
            <a href="#menu" className="btn btn-warning btn-lg px-4 py-2 fw-bold">
              Explore Menu
            </a>
            <a href="#contact" className="btn btn-outline-light btn-lg px-4 py-2">
              Reserve Table
            </a>
          </div>
        </div>
      </header>

      {/* Featured Menu Section */}
      <section  className="py-5" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="fw-bold display-5">Our <span className="text-warning">Signature</span> Dishes</h2>
            <p className="text-muted">Handcrafted with passion and the finest ingredients</p>
          </div>
          <div className="row g-4">
            {[
              { 
                name: "Grilled Salmon", 
                img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", 
                desc: "Fresh Atlantic salmon with herbs and lemon butter sauce.", 
                price: "$24.99"
              },
              { 
                name: "Truffle Pasta", 
                img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", 
                desc: "Homemade fettuccine with black truffle and parmesan.", 
                price: "$19.99"
              },
              { 
                name: "Wagyu Burger", 
                img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", 
                desc: "Premium Wagyu beef patty with aged cheddar.", 
                price: "$22.99"
              }
            ].map((dish, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <div className="card-img-top overflow-hidden" style={{height: '200px'}}>
                    <img src={dish.img} className="img-fluid w-100 h-100 object-fit-cover" alt={dish.name} />
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title fw-bold">{dish.name}</h5>
                      <span className="badge bg-warning text-dark">{dish.price}</span>
                    </div>
                    <p className="card-text text-muted">{dish.desc}</p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <button className="btn btn-dark w-100">Add to Order</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <a href="#" className="btn btn-outline-dark btn-lg">View Full Menu</a>
          </div>
        </div>
      </section>

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
              <div className="mt-4">
                <a href="#" className="btn btn-warning btn-lg">Meet Our Chefs</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5" style={{backgroundColor: '#fffaf0'}}>
        <div className="container">
          <h2 className="text-center fw-bold mb-5">What Our <span className="text-warning">Guests</span> Say</h2>
          <div className="row g-4">
            {[
              {
                quote: "The best dining experience I've had this year! The truffle pasta was absolutely divine.",
                author: "Sarah Johnson",
                role: "Food Critic"
              },
              {
                quote: "Every dish was a masterpiece. The service was impeccable and the ambiance perfect.",
                author: "Michael Chen",
                role: "Regular Guest"
              },
              {
                quote: "The Wagyu burger lives up to the hype. I keep coming back for more!",
                author: "Emily Rodriguez",
                role: "Local Guide"
              }
            ].map((testimonial, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="card-body text-center">
                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star text-warning"></i>
                      ))}
                    </div>
                    <p className="card-text fst-italic mb-4">"{testimonial.quote}"</p>
                    <h5 className="card-title fw-bold mb-1">{testimonial.author}</h5>
                    <p className="card-text text-muted small">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold display-6 mb-4">Get in <span className="text-warning">Touch</span></h2>
              <p className="lead mb-5">We'd love to hear from you. Reserve a table or ask us anything.</p>
              
              <div className="row g-4 text-start">
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-map-marker-alt text-warning fs-4 mt-1 me-3"></i>
                    <div>
                      <h5 className="fw-bold">Location</h5>
                      <p className="text-muted">123 Food Street, Flavor Town, USA</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-phone-alt text-warning fs-4 mt-1 me-3"></i>
                    <div>
                      <h5 className="fw-bold">Call Us</h5>
                      <p className="text-muted">(123) 456-7890</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-envelope text-warning fs-4 mt-1 me-3"></i>
                    <div>
                      <h5 className="fw-bold">Email Us</h5>
                      <p className="text-muted">contact@gourmetbite.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <form className="mt-5">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control form-control-lg" placeholder="Your Name" />
                  </div>
                  <div className="col-md-6">
                    <input type="email" className="form-control form-control-lg" placeholder="Your Email" />
                  </div>
                  <div className="col-12">
                    <input type="text" className="form-control form-control-lg" placeholder="Subject" />
                  </div>
                  <div className="col-12">
                    <textarea className="form-control form-control-lg" rows="5" placeholder="Your Message"></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-warning btn-lg px-5 py-3 fw-bold">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
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
                <li className="mb-2"><a href="#contact" className="text-white text-decoration-none">Contact</a></li>
                <li><a href="#" className="text-white text-decoration-none">Reservations</a></li>
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
            <div className="col-lg-3 col-md-4">
              <h5 className="fw-bold mb-4">Newsletter</h5>
              <p>Subscribe to get updates on special offers and events.</p>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Your Email" />
                <button className="btn btn-warning" type="button">Subscribe</button>
              </div>
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
      
    </div>
  );
}

export default HomePage;