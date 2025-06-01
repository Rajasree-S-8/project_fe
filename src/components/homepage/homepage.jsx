import React from 'react';

const Homepage = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>GrandVista Hotel - Welcome</title>
      
      <header>
        <div className="logo" aria-label="GrandVista Hotel Logo">
          GrandVista
        </div>
        <nav aria-label="Primary navigation">
          <ul>
         <li>
  <a href="#" tabindex="0">
    <i class="fas fa-home me-1"></i> Home
  </a>
</li>
<li>
  <a href="#" tabindex="0">
    <i class="fas fa-info-circle me-1"></i> About
  </a>
</li>
<li>
  <a href="#" tabindex="0">
    <i class="fas fa-bed me-1"></i> Rooms
  </a>
</li>
<li>
  <a href="#" tabindex="0">
    <i class="fas fa-concierge-bell me-1"></i> Services
  </a>
</li>
<li>
  <a href="#" tabindex="0">
    <i class="fas fa-calendar-check me-1"></i> Booking
  </a>
</li>
<li class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" href="#" id="loginDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    <i class="fas fa-user me-1"></i> Hotel Login
  </a>
  <ul class="dropdown-menu" aria-labelledby="loginDropdown">
    <li>
      <a class="dropdown-item" href="/admin-login">
        <i class="fas fa-user-shield me-2"></i> Admin Login
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="/customer-login">
        <i class="fas fa-user me-2"></i> Customer Login
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="/hotel-manager-login">
        <i class="fas fa-hotel me-2"></i> Hotel Manager
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="/restaurant-manager-login">
        <i class="fas fa-utensils me-2"></i> Restaurant Manager
      </a>
    </li>
  </ul>
</li>




          </ul>
        </nav>
      </header>
      
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
      
  <footer>
  <p>© 2024 GrandVista Hotel. All rights reserved.</p>
  <p>
    Contact us: 
    <a href="mailto:contact@grandvistahotel.com">
      contact@grandvistahotel.com
    </a> 
    | Phone: +1 (555) 123-4567
  </p>
  <p class="social-icons">
    <a href="https://wa.me/15551234567" target="_blank" aria-label="WhatsApp">
      <i class="fab fa-whatsapp fa-lg"></i>
    </a>
    <a href="https://facebook.com/grandvistahotel" target="_blank" aria-label="Facebook">
      <i class="fab fa-facebook-f fa-lg"></i>
    </a>
    <a href="https://twitter.com/grandvistahotel" target="_blank" aria-label="Twitter">
      <i class="fab fa-twitter fa-lg"></i>
    </a>
    <a href="https://instagram.com/grandvistahotel" target="_blank" aria-label="Instagram">
      <i class="fab fa-instagram fa-lg"></i>
    </a>
  </p>
</footer>
    </>
  );
}

export default Homepage;