import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <p>© 2024 GrandVista Hotel. All rights reserved.</p>
      <p>
        Contact us: 
        <a href="mailto:contact@grandvistahotel.com">
          contact@grandvistahotel.com
        </a> 
        | Phone: +1 (555) 123-4567
      </p>
      <p className="social-icons">
        <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <i className="fab fa-whatsapp fa-lg"></i>
        </a>
        <a href="https://facebook.com/grandvistahotel" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <i className="fab fa-facebook-f fa-lg"></i>
        </a>
        <a href="https://twitter.com/grandvistahotel" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <i className="fab fa-twitter fa-lg"></i>
        </a>
        <a href="https://instagram.com/grandvistahotel" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram fa-lg"></i>
        </a>
      </p>
    </footer>
  );
};

export default Footer;