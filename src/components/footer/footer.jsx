import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <p>© 2025 Revzz Hotel. All rights reserved.</p>
      <p>
        Contact us: 
        <a href="mailto:contact@revzzhotel.com">
          contact@revzzhotel.com
        </a> 
        | Phone: +91 9876543210
      </p>
      <p className="social-icons">
        <a href="https://wa.me/9876543210" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <i className="fab fa-whatsapp fa-lg"></i>
        </a>
        <a href="https://facebook.com/revzzhotel" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <i className="fab fa-facebook-f fa-lg"></i>
        </a>
        <a href="https://twitter.com/revzzhotel" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <i className="fab fa-twitter fa-lg"></i>
        </a>
        <a href="https://instagram.com/revzzhotel" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram fa-lg"></i>
        </a>
      </p>
    </footer>
  );
};

export default Footer;