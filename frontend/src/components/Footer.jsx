import { FaWater, FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <div className="footer-logo">
            <FaWater />
            <h2>Kalu River Flood Monitoring System</h2>
          </div>
          <p>
            Real-time monitoring and early warning system for Kalu River, Sri Lanka.
            Delivering timely alerts to help protect lives and property.
          </p>
          <div className="footer-social">
            <a href="#" className="social-icon">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
          </div>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item">
              <a href="/" className="footer-link">Home</a>
            </li>
            <li className="footer-link-item">
              <a href="/dashboard" className="footer-link">Dashboard</a>
            </li>
            <li className="footer-link-item">
              <a href="/register" className="footer-link">Register for Alerts</a>
            </li>
            <li className="footer-link-item">
              <a href="/login" className="footer-link">Login</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-copyright">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} - Real-Time Flood Monitoring and Early Warning System</p>
          <p>Data provided by RiverNet.lk</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;