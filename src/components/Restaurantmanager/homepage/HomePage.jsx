import React from "react";
import Header from "../header/Header.jsx";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <header className="home-hero-section">
        <div className="home-hero-overlay"></div>
        <div className="container home-hero-content text-center text-white">
          <h1 className="display-3 fw-bold mb-3">
            Welcome to <span className="text-warning">Revzz</span> Hotel
          </h1>
          <p className="lead fs-4 mb-4">Restaurant Manager</p>
        </div>
      </header>
    </div>
  );
}

export default HomePage;