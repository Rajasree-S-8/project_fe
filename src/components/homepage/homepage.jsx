import React from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container"> {/* Added container div */}
      <Header />
      
      <main>
      <section id="main-carousel" className="carousel slide" data-bs-ride="carousel"   data-bs-interval="1200"
 aria-label="Hotel images carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.pexels.com/photos/161758/governor-s-mansion-montgomery-alabama-grand-staircase-161758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="d-block w-100"
                alt="Hotel Room 1"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="d-block w-100"
                alt="Hotel Room 2"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="d-block w-100"
                alt="Hotel Dining"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="d-block w-100"
                alt="Hotel Spa"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/2291624/pexels-photo-2291624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="d-block w-100"
                alt="Hotel Event Hall"
              />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#main-carousel" data-bs-slide="prev" aria-label="Previous slide">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>

          <button className="carousel-control-next" type="button" data-bs-target="#main-carousel" data-bs-slide="next" aria-label="Next slide">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </section>
        
        <div class="highlights-section">
  <h2>Our Highlights</h2>
  <div class="highlights-grid">
    <div class="highlight-card">
      <img src="https://img.icons8.com/ios-filled/100/00509e/bed.png" alt="Bed icon" />
      <h3>Comfortable Rooms</h3>
      <p>Experience luxury and comfort in our well-furnished rooms.</p>
    </div>
    <div class="highlight-card">
      <img src="https://img.icons8.com/ios-filled/100/00509e/restaurant.png" alt="Restaurant icon" />
      <h3>Delicious Dining</h3>
      <p>Enjoy a variety of cuisines in our in-house restaurant.</p>
    </div>
    <div class="highlight-card">
      <img src="https://img.icons8.com/ios-filled/100/00509e/spa.png" alt="Spa icon" />
      <h3>Spa & Wellness</h3>
      <p>Relax and rejuvenate with our spa and wellness services.</p>
    </div>
    <div class="highlight-card">
      <img src="https://img.icons8.com/ios-filled/100/00509e/conference.png" alt="Conference icon" />
      <h3>Conference Facilities</h3>
      <p>Host your meetings and events with our modern amenities.</p>
    </div>
  </div>
</div>

        
      <section class="special-offers-section">
  <div class="special-offers-container">
    <h2>Special Offers</h2>
    <p>Enjoy exclusive discounts and packages tailored just for you.</p>
    <a href="#" class="special-btn"onClick={() => alert('if want to see offers, customer must be login!')}>
 View Offers</a>
  </div>
</section>

      </main>
      
      <Footer />
    </div>
  );
}

export default Homepage;