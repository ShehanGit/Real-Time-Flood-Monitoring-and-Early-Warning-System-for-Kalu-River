import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBell, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/api';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    alertThreshold: 5.2
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || 'Kalu Ganga (Ratnapura)',
        alertThreshold: user.alertThreshold || 5.2
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccessMessage('');
      setIsSubmitting(true);
      
      const updatedData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        alertThreshold: Number(formData.alertThreshold)
      };
      
      const updatedUser = await updateUserProfile(updatedData);
      updateUser(updatedUser);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-body">
            <p className="text-center">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">
            <FaUser /> Your Profile
          </h2>
        </div>
        
        <div className="profile-body">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-form-group">
              <label className="profile-label" htmlFor="name">
                Full Name
              </label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="profile-input"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            
            <div className="profile-form-group">
              <label className="profile-label" htmlFor="email">
                Email Address
              </label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="profile-input"
                  disabled={true}
                />
              </div>
              <p className="profile-email-note">Email cannot be changed</p>
            </div>
            
            <div className="profile-form-group">
              <label className="profile-label" htmlFor="phone">
                Phone Number
              </label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="profile-input"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            
            <div className="profile-form-group">
              <label className="profile-label" htmlFor="location">
                Location
              </label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon">
                  <FaMapMarkerAlt />
                </div>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="profile-select"
                  disabled={!isEditing}
                  required
                >
                  <option value="Kalu Ganga (Ratnapura)">Kalu Ganga (Ratnapura)</option>
                  <option value="Kukule Ganga (Kalawana)">Kukule Ganga (Kalawana)</option>
                </select>
              </div>
            </div>
            
            <div className="profile-form-group">
              <label className="profile-label" htmlFor="alertThreshold">
                Alert Threshold (meters)
              </label>
              <div className="threshold-container">
                <div className="threshold-icon">
                  <FaBell />
                </div>
                <input
                  type="range"
                  id="alertThreshold"
                  name="alertThreshold"
                  min="5.2"
                  max="10.5"
                  step="0.1"
                  value={formData.alertThreshold}
                  onChange={handleChange}
                  className="threshold-range"
                  disabled={!isEditing}
                />
                <span className="threshold-value">{formData.alertThreshold}m</span>
              </div>
              <div className="threshold-labels">
                <span>5.2m (Alert)</span>
                <span>7.5m (Minor)</span>
                <span>9.5m (Major)</span>
                <span>10.5m (Critical)</span>
              </div>
            </div>
            
            <div className="profile-buttons">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="profile-btn cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="profile-btn save-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="profile-spinner"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="profile-btn edit-btn"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
          
          <div className="profile-info">
            <h3 className="profile-info-title">About Alert Thresholds</h3>
            <p className="profile-info-text">
              You will receive email alerts when the water level at your selected location 
              reaches or exceeds your chosen alert threshold. Adjust this value based on your 
              proximity to the river and personal risk assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;