import './Footer.css';

//import imgs
import bottom from './../../img/bottom.png';
import fbLogo from './../../img/fb-logo.png';
import igLogo from './../../img/ig-logo.png';
import kseaLogo from './../../img/ksea-logo.png';

export default function Footer() {
  return (
    <div>
      <div className="logo fb-logo">
        <a href="https://www.facebook.com/kseaatcal">
          <img src={fbLogo} alt="fb logo"/>
        </a>
      </div>
      <div className="logo ig-logo">
        <a href="https://www.instagram.com/kseaatcal/">
          <img src={igLogo} alt="ig logo"/>
        </a>
      </div>
      <h1>Created & Designed by</h1>
      <div className="logo ksea-logo">
        <img src={kseaLogo} alt="ksea logo"/>
      </div>
      <img src={bottom} alt="bottom"/>
    </div>
  )
}