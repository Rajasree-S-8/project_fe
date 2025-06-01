import React from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container"> {/* Added container div */}
      <Header />
      
      <main>
        <section className="hero" role="region" aria-label="Hotel welcome banner">
          <div className="hero-content">
            <h1>Welcome to GrandVista Hotel</h1>
            <button
              className="btn-primary"
              onClick={() => alert('Booking system coming soon!')}
            >
              Book a Room
            </button>
          </div>
        </section>
        
        <section aria-labelledby="features-title">
          <h2 id="features-title" className="section-title">
            Our Highlights
          </h2>
          <div className="features">
            <article
              className="feature-card"
              tabIndex={0}
              aria-label="Luxurious rooms"
            >
              <img
                src="https://img.icons8.com/ios-filled/100/00509e/bed.png"
                alt="Bed icon"
              />
              <h3>Luxurious Rooms</h3>
              <p>
                Experience spacious rooms with modern amenities and stunning views
                for a restful stay.
              </p>
            </article>
            
            <article
              className="feature-card"
              tabIndex={0}
              aria-label="World-class dining"
            >
              <img
                src="https://img.icons8.com/ios-filled/100/00509e/restaurant.png"
                alt="Restaurant icon"
              />
              <h3>World-class Dining</h3>
              <p>
                Savor delicious international cuisines crafted by our renowned
                chefs in elegant settings.
              </p>
            </article>
            
            <article
              className="feature-card"
              tabIndex={0}
              aria-label="Wellness & Spa"
            >
              <img
                src="https://img.icons8.com/ios-filled/100/00509e/spa.png"
                alt="Spa icon"
              />
              <h3>Wellness &amp; Spa</h3>
              <p>
                Relax and rejuvenate with a wide range of spa treatments and
                wellness therapies.
              </p>
            </article>
            
            <article
              className="feature-card"
              tabIndex={0}
              aria-label="Event & Meetings"
            >
              <img
                src="https://img.icons8.com/ios-filled/100/00509e/conference-call.png"
                alt="Conference icon"
              />
              <h3>Event &amp; Meetings</h3>
              <p>
                Host unforgettable weddings, conferences, and social events in our
                versatile venues.
              </p>
            </article>
          </div>
        </section>
        
        <section className="offers" aria-labelledby="offers-title">
          <h2 id="offers-title">Special Offers</h2>
          <p>
            Book now and enjoy exclusive discounts! Limited time only. Upgrade
            your stay with complimentary breakfast &amp; late checkout.
          </p>
          <button
            className="btn-secondary"
            onClick={() => alert('Special offers coming soon!')}
          >
            Explore Offers
          </button>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default Homepage;