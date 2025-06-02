import React, { useState } from 'react';
import './css/Login.css'
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home")
    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      setSuccess(false);
      return;
    }
    setError('');
    setSuccess(true);
    alert('Successfully Logged In!', formData);
    setFormData({
      username: '',
      password: '',
    });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Hotel Manager</a>
          <div className="navbar-nav">
            <a className="nav-link" href="#">Home</a>
          </div>
        </div>
      </nav>
      <div className="container">
        <h1>Login</h1>
        {success && <div className="alert alert-success">Login successful!</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;