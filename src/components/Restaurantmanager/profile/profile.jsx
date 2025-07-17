import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header.jsx";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const restaurantManager = JSON.parse(localStorage.getItem("restaurantManager"));
    if (!restaurantManager) {
      navigate("/restaurantlog");
    } else {
      setTimeout(() => {
        setUser(restaurantManager);
        setEditedUser(restaurantManager);
        if (restaurantManager.image) {
          setPreviewUrl(`http://localhost:8080/api/files/uploads/${restaurantManager.image}`);
        }
        setIsLoading(false);
      }, 800);
    }
  }, [navigate]);

  const handleLogout = () => {
    document.querySelector(".profile-card").classList.add("animate__fadeOut");
    setTimeout(() => {
      localStorage.removeItem("restaurantManager");
      navigate("/restaurantlog");
    }, 500);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // If a new file was selected, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("staff", JSON.stringify(editedUser));

        const response = await fetch(`http://localhost:8080/api/staff/update/${user.id}`, {
          method: "PUT",
          body: formData,
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem("restaurantManager", JSON.stringify(updatedUser));
          if (updatedUser.image) {
            setPreviewUrl(`http://localhost:8080/api/files/uploads/${updatedUser.image}`);
          }
        }
      } else {
        // No file selected, just update the user info
        const response = await fetch(`http://localhost:8080/api/staff/update/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem("restaurantManager", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsEditing(false);
      setSelectedFile(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      <Header />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="profile-card card shadow-lg animate__animated animate__fadeInUp">
              <div className="card-header bg-gradient-dark mt-0">
                <h3 className="mb-0 text-center">
                  <i className="fas fa-user-tie me-2"></i>
                  Manager Profile
                </h3>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <div className="profile-avatar-container text-center mb-4">
                  <div className="profile-avatar shadow">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile" 
                        className="avatar-image"
                      />
                    ) : (
                      <span className="avatar-initial">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="status-indicator bg-success"></div>
                  </div>
                  <h4 className="mt-3 mb-1">{user.username}</h4>
                  <div className="badge bg-warning text-dark rounded-pill px-3 py-1">
                    <i className="fas fa-utensils me-1"></i> {user.role}
                  </div>
                  {isEditing && (
                    <div className="mt-3">
                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="d-none"
                      />
                      <label 
                        htmlFor="profile-image" 
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="fas fa-camera me-1"></i> Change Photo
                      </label>
                    </div>
                  )}
                </div>

                <div className="profile-details">
                  <div className="detail-card">
                    <div className="detail-icon bg-primary-light">
                      <i className="fas fa-id-card text-primary"></i>
                    </div>
                    <div>
                      <h6>Full Name</h6>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullname"
                          value={editedUser.fullname || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{user.fullname || <span className="text-muted">Not specified</span>}</p>
                      )}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-success-light">
                      <i className="fas fa-envelope text-success"></i>
                    </div>
                    <div>
                      <h6>Email</h6>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedUser.email || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{user.email || <span className="text-muted">Not specified</span>}</p>
                      )}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-info-light">
                      <i className="fas fa-phone text-info"></i>
                    </div>
                    <div>
                      <h6>Phone</h6>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phonenumber"
                          value={editedUser.phonenumber || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{user.phonenumber || <span className="text-muted">Not specified</span>}</p>
                      )}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-warning-light">
                      <i className="fas fa-map-marker-alt text-warning"></i>
                    </div>
                    <div>
                      <h6>Address</h6>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={editedUser.address || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{user.address || <span className="text-muted">Not specified</span>}</p>
                      )}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon bg-danger-light">
                      <i className="fas fa-birthday-cake text-danger"></i>
                    </div>
                    <div>
                      <h6>Age</h6>
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          value={editedUser.age || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <p>{user.age || <span className="text-muted">Not specified</span>}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-actions mt-5">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-success btn-lg rounded-pill px-4"
                        onClick={handleSave}
                      >
                        <i className="fas fa-save me-2"></i> Save
                      </button>
                      <button
                        className="btn btn-secondary btn-lg rounded-pill px-4 ms-3"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedFile(null);
                          setPreviewUrl(user.image ? `http://localhost:8080/api/files/uploads/${user.image}` : "");
                        }}
                      >
                        <i className="fas fa-times me-2"></i> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-lg rounded-pill px-4"
                      onClick={handleEdit}
                    >
                      <i className="fas fa-edit me-2"></i> Edit
                    </button>
                  )}
                  <button
                    className="btn btn-outline-secondary btn-lg rounded-pill px-4 ms-3"
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