import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: 'Kalu Ganga (Ratnapura)',
    alertThreshold: 5.2
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  const { name, email, phone, password, confirmPassword, location, alertThreshold } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      // Register the user
      const data = await registerUser({
        name,
        email,
        phone,
        password,
        location,
        alertThreshold: Number(alertThreshold)
      });
      
      // If registration successful, login the user
      if (data && data.token) {
        await loginUser({ email, password });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">
            <FaUserPlus /> Register for Flood Alerts
          </h2>
        </div>
        
        <div className="register-body">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form-group">
              <label className="register-label" htmlFor="name">
                Full Name
              </label>
              <div className="register-input-wrapper">
                <div className="register-input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="register-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            
            <div className="register-form-group">
              <label className="register-label" htmlFor="email">
                Email Address
              </label>
              <div className="register-input-wrapper">
                <div className="register-input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="register-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="register-form-group">
              <label className="register-label" htmlFor="phone">
                Phone Number
              </label>
              <div className="register-input-wrapper">
                <div className="register-input-icon">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  className="register-input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
            
            <div className="register-form-group">
              <label className="register-label" htmlFor="location">
                Location
              </label>
              <div className="register-input-wrapper">
                <div className="register-input-icon">
                  <FaMapMarkerAlt />
                </div>
                <select
                  id="location"
                  name="location"
                  value={location}
                  onChange={handleChange}
                  className="register-select"
                  required
                >
                  <option value="Kalu Ganga (Ratnapura)">Kalu Ganga (Ratnapura)</option>
                  <option value="Kukule Ganga (Kalawana)">Kukule Ganga (Kalawana)</option>
                </select>
              </div>
            </div>
            
            <div className="register-form-group">
              <label className="register-label" htmlFor="alertThreshold">
                Alert Threshold (meters)
              </label>
              <div className="slider-container">
                <input
                  type="range"
                  id="alertThreshold"
                  name="alertThreshold"
                  min="5.2"
                  max="10.5"
                  step="0.1"
                  value={alertThreshold}
                  onChange={handleChange}
                  className="slider-range"
                />
                <div className="slider-labels">
                  <span>5.2m (Alert)</span>
                  <span>7.5m (Minor)</span>
                  <span>9.5m (Major)</span>
                  <span>10.5m (Critical)</span>
                </div>
              </div>
              <p className="threshold-value">
                You'll be notified when water level reaches {alertThreshold}m
              </p>
            </div>
            
            <div className="register-form-group">
              <label className="register-label" htmlFor="password">
                Password
              </label>
              <div className="register-input-wrapper">
                <div className="register-input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="register-input"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <div className="register-form-group">
              <label className="register-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="register-input-wrapper">
                <div className="register-input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="register-input"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="register-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="register-spinner"></span>
                  Registering...
                </>
              ) : (
                <>Register</>
              )}
            </button>
          </form>
          
          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;