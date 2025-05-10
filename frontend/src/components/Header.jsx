import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaWater, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="header-logo">
          <FaWater />
          <h1>Kalu River Monitoring</h1>
        </Link>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FaBars />
        </button>
        
        <nav className="header-nav">
          <ul className={`header-nav-list ${mobileMenuOpen ? 'open' : ''}`}>
            <li className="header-nav-item">
              <Link to="/" className="header-nav-link">
                Home
              </Link>
            </li>
            <li className="header-nav-item">
              <Link to="/dashboard" className="header-nav-link">
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="header-nav-item">
                  <Link to="/profile" className="header-nav-link">
                    <FaUser /> {user.name}
                  </Link>
                </li>
                <li className="header-nav-item">
                  <button 
                    onClick={logoutUser}
                    className="header-auth-btn logout-btn"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="header-nav-item">
                  <Link 
                    to="/login" 
                    className="header-auth-btn login-btn"
                  >
                    <FaSignInAlt /> Login
                  </Link>
                </li>
                <li className="header-nav-item">
                  <Link 
                    to="/register" 
                    className="header-auth-btn register-btn"
                  >
                    <FaUserPlus /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;