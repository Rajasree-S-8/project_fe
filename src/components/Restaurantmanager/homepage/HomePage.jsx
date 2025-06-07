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
    </div>
  );
}

export default HomePage;