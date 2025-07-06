    import { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import './Profile.css';

    const Profile = ({ setActiveSection }) => {
    const navigate = useNavigate();
    const staffId = localStorage.getItem('staffId');
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        address: '',
        age: '',
        phonenumber: '',
        role: 'Hotel Manager',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
        window.scrollTo(0, 0); // Scroll to top when component mounts
    }, []);

    const fetchProfile = async () => {
        if (!staffId) {
        setError('Please log in to view your profile.');
        navigate('/restaurantlog');
        return;
        }

        try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/api/staff/all`, {
            headers: {
            'X-Staff-Id': staffId,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data.');
        }

        const staffList = await response.json();
        const staff = staffList.find((s) => s.staffId === parseInt(staffId));
        if (staff) {
            setFormData({
            username: staff.username || '',
            fullname: staff.fullname || '',
            email: staff.email || '',
            address: staff.address || '',
            age: staff.age ? staff.age.toString() : '',
            phonenumber: staff.phonenumber || '',
            role: staff.role || 'Hotel Manager',
            });
        } else {
            setError('Profile not found.');
        }
        } catch (err) {
        console.error('Fetch profile error:', err);
        setError(err.message || 'Unable to connect to the server.');
        } finally {
        setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (!staffId) {
        setError('Please log in to update your profile.');
        setIsLoading(false);
        return;
        }

        if (!formData.username || !formData.fullname || !formData.email || !formData.age || !formData.phonenumber) {
        setError('All fields are required.');
        setIsLoading(false);
        return;
        }

        if (formData.age && (isNaN(formData.age) || formData.age <= 0)) {
        setError('Please enter a valid age.');
        setIsLoading(false);
        return;
        }

        try {
        const response = await fetch(`http://localhost:8080/api/staff/update/${staffId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'X-Staff-Id': staffId,
            },
            body: JSON.stringify({
            username: formData.username,
            fullname: formData.fullname,
            email: formData.email,
            address: formData.address,
            age: parseInt(formData.age),
            phonenumber: formData.phonenumber,
            role: formData.role,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to update profile: ${errorData || response.statusText}`);
        }

        const updatedStaff = await response.json();
        localStorage.setItem('username', updatedStaff.username); // Update username in localStorage
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
        console.error('Update profile error:', err);
        setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
        setIsLoading(false);
        }
    };

    const handleLogout = () => {
        document.querySelector(".profile-card").classList.add("animate__fadeOut");
        setTimeout(() => {
        localStorage.removeItem("staffId");
        navigate("/restaurantlog");
        }, 500);
    };

    if (isLoading && !isEditing) {
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
                <div className="card-body p-4 p-md-5">
                    {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <i className="fas fa-check-circle me-2"></i>
                        {success}
                        <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
                    </div>
                    )}
                    {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                    </div>
                    )}

                    {!isEditing ? (
                    <>
                        <div className="profile-avatar-container text-center mb-4">
                        <div className="profile-avatar shadow">
                            <span className="avatar-initial">
                            {formData.username.charAt(0).toUpperCase()}
                            </span>
                            <div className="status-indicator bg-success"></div>
                        </div>
                        <h4 className="mt-3 mb-1">{formData.username}</h4>
                        <div className="badge bg-warning text-dark rounded-pill px-3 py-1">
                            <i className="fas fa-utensils me-1"></i> {formData.role}
                        </div>
                        </div>

                        <div className="profile-details">
                        <div className="detail-card">
                            <div className="detail-icon bg-primary-light">
                            <i className="fas fa-id-card text-primary"></i>
                            </div>
                            <div>
                            <h6>Full Name</h6>
                            <p>{formData.fullname || <span className="text-muted">Not specified</span>}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-success-light">
                            <i className="fas fa-envelope text-success"></i>
                            </div>
                            <div>
                            <h6>Email</h6>
                            <p>{formData.email || <span className="text-muted">Not specified</span>}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-info-light">
                            <i className="fas fa-phone text-info"></i>
                            </div>
                            <div>
                            <h6>Phone</h6>
                            <p>{formData.phonenumber || <span className="text-muted">Not specified</span>}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-warning-light">
                            <i className="fas fa-map-marker-alt text-warning"></i>
                            </div>
                            <div>
                            <h6>Address</h6>
                            <p>{formData.address || <span className="text-muted">Not specified</span>}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-danger-light">
                            <i className="fas fa-birthday-cake text-danger"></i>
                            </div>
                            <div>
                            <h6>Age</h6>
                            <p>{formData.age || <span className="text-muted">Not specified</span>}</p>
                            </div>
                        </div>
                        </div>
                    </>
                    ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="profile-details">
                        <div className="detail-card">
                            <div className="detail-icon bg-primary-light">
                            <i className="fas fa-user text-primary"></i>
                            </div>
                            <div>
                            <h6>Username *</h6>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-primary-light">
                            <i className="fas fa-id-card text-primary"></i>
                            </div>
                            <div>
                            <h6>Full Name *</h6>
                            <input
                                type="text"
                                className="form-control"
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-success-light">
                            <i className="fas fa-envelope text-success"></i>
                            </div>
                            <div>
                            <h6>Email *</h6>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-info-light">
                            <i className="fas fa-phone text-info"></i>
                            </div>
                            <div>
                            <h6>Phone Number *</h6>
                            <input
                                type="text"
                                className="form-control"
                                id="phonenumber"
                                name="phonenumber"
                                value={formData.phonenumber}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-warning-light">
                            <i className="fas fa-map-marker-alt text-warning"></i>
                            </div>
                            <div>
                            <h6>Address *</h6>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                required
                            />
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon bg-danger-light">
                            <i className="fas fa-birthday-cake text-danger"></i>
                            </div>
                            <div>
                            <h6>Age *</h6>
                            <input
                                type="number"
                                className="form-control"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                min="1"
                                required
                            />
                            </div>
                        </div>
                        </div>

                        <div className="profile-actions mt-5">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg rounded-pill px-4"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Saving...
                            </>
                            ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                            </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-lg rounded-pill px-4 ms-3"
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                        >
                            <i className="fas fa-times me-2"></i>
                            Cancel
                        </button>
                        </div>
                    </form>
                    )}

                    {!isEditing && (
                    <div className="profile-actions mt-5">
                        <button
                        className="btn btn-primary btn-lg rounded-pill px-4"
                        onClick={() => setIsEditing(true)}
                        disabled={isLoading}
                        >
                        <i className="fas fa-edit me-2"></i> Edit Profile
                        </button>
                        <button
                        className="btn btn-danger btn-lg rounded-pill px-4 ms-3"
                        onClick={handleLogout}
                        disabled={isLoading}
                        >
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                        </button>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default Profile;