import './Footer.css';
import { Link } from 'react-router-dom';

//import imgs
import bottom from './../../img/bottom.png';
import fbLogo from './../../img/fb-logo.png';
import igLogo from './../../img/ig-logo.png';
import kseaLogo from './../../img/ksea-logo.png';

export default function Footer() {
  return (
    <div>
      <div className="logo fb-logo">
        <a href="https://www.facebook.com/kseaatcal" target="_blank" rel="noopener noreferrer">
          <img src={fbLogo} alt="fb logo"/>
        </a>
      </div>
      <div className="logo ig-logo">
        <a href="https://www.instagram.com/kseaatcal/" target="_blank" rel="noopener noreferrer">
          <img src={igLogo} alt="ig logo"/>
        </a>
      </div>
      <Link to="/about-us">
        <button type="button" className="abtus-btn">
          About Us
        </button>
      </Link>
      <h1>Created & Designed by</h1>
      <div className="logo ksea-logo">
        <img src={kseaLogo} alt="ksea logo"/>
      </div>
      <img src={bottom} alt="bottom"/>
    </div>
  )
}