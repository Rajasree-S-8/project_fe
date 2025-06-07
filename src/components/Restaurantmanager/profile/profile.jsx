import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restaurantManager = JSON.parse(localStorage.getItem("restaurantManager"));
    if (!restaurantManager) {
      navigate("/restaurantlog");
    } else {
      // Simulate loading for better UX
      setTimeout(() => {
        setUser(restaurantManager);
        setIsLoading(false);
      }, 800);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Add smooth logout transition
    document.querySelector(".profile-card").classList.add("animate__fadeOut");
    setTimeout(() => {
      localStorage.removeItem("restaurantManager");
      navigate("/restaurantlog");
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page animate__animated animate__fadeIn">
      
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="profile-card card shadow-lg animate__animated animate__fadeInUp">
              <div className="card-header bg-gradient-dark">
                <h3 className="mb-0 text-center">
                  <i className="fas fa-user-tie me-2"></i>
                  Manager Profile
                </h3>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <div className="profile-avatar-container text-center mb-4">
                  <div className="profile-avatar shadow">
                    <span className="avatar-initial">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                    <div className="status-indicator bg-success"></div>
                  </div>
                  <h4 className="mt-3 mb-1">{user.username}</h4>
                  <div className="badge bg-warning text-dark rounded-pill px-3 py-1">
                    <i className="fas fa-utensils me-1"></i> {user.role}
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-card">
                    <div className="detail-icon bg-primary-light">
                      <i className="fas fa-id-card text-primary"></i>
                    </div>
                    <div>
                      <h6>Full Name</h6>
                      <p>{user.fullname || <span className="text-muted">Not specified</span>}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-success-light">
                      <i className="fas fa-envelope text-success"></i>
                    </div>
                    <div>
                      <h6>Email</h6>
                      <p>{user.email || <span className="text-muted">Not specified</span>}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-info-light">
                      <i className="fas fa-phone text-info"></i>
                    </div>
                    <div>
                      <h6>Phone</h6>
                      <p>{user.phonenumber || <span className="text-muted">Not specified</span>}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-warning-light">
                      <i className="fas fa-map-marker-alt text-warning"></i>
                    </div>
                    <div>
                      <h6>Address</h6>
                      <p>{user.address || <span className="text-muted">Not specified</span>}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-danger-light">
                      <i className="fas fa-birthday-cake text-danger"></i>
                    </div>
                    <div>
                      <h6>Age</h6>
                      <p>{user.age || <span className="text-muted">Not specified</span>}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-actions mt-5">
                  <button 
                    className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                    onClick={() => navigate("/restauranthome")}
                  >
                    <i className="fas fa-arrow-left me-2"></i> Dashboard
                  </button>
                  <button 
                    className="btn btn-danger btn-lg rounded-pill px-4 ms-3"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Profile;